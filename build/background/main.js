"use strict";

var d = new Date(),
    day = d.getUTCDay(),
    setIcon = function setIcon() {
  switch (weh.prefs.skin) {
    case "MID":
      browser.browserAction.setIcon({ path: {
          16: "content/images/mid-icon-16.png",
          32: "content/images/mid-icon-32.png",
          48: "content/images/mid-icon-48.png",
          64: "content/images/mid-icon-64.png",
          128: "content/images/mid-icon-128.png"
        } });
      break;
    case "SCLS":
      browser.browserAction.setIcon({ path: {
          16: "content/images/scls-icon-16.png",
          32: "content/images/scls-icon-32.png",
          48: "content/images/scls-icon-48.png",
          64: "content/images/scls-icon-64.png",
          128: "content/images/scls-icon-128.png"
        } });
      break;
    default:
      browser.browserAction.setIcon({ path: {
          16: "content/images/mpl-icon-16.png",
          32: "content/images/mpl-icon-32.png",
          48: "content/images/mpl-icon-48.png",
          64: "content/images/mpl-icon-64.png",
          128: "content/images/mpl-icon-128.png"
        } });
  }
},

/** The addresses below are for querying Google Maps
  * when a patron wants to know the geographically
  * closest library to their residential address */
libraryAddresses = [
// MPL  [0-8]
["HPB", "733+N+High+Point+Rd,+Madison,+WI+53717"], ["MAD", "201+W+Mifflin+St,+Madison,+WI+53703"], ["HAW", "2707+E+Washington+Ave,+Madison,+WI+53704"], ["LAK", "2845+N+Sherman+Ave,+Madison,+WI+53704"], ["MEA", "5726+Raymond+Rd,+Madison,+WI+53711"], ["MSB", "1705+Monroe+St,+Madison,+WI+53711"], ["PIN", "204+Cottage+Grove+Rd,+Madison,+WI+53716"], ["SEQ", "4340+Tokay+Blvd,+Madison,+WI+53711"], ["SMB", "2222+S+Park+St,+Madison,+WI+53713"],

// OTHER DANE COUNTY [9-26]
["BLV", "130+S+Vine+St,+Belleville,+WI+53508"], ["BER", "1210+Mills+St,+Black+Earth,+WI+53515"], ["CBR", "101+Spring+Water+Alley,+Cambridge,+WI+53523"], ["CSP", "2107+Julius+St,+Cross+Plains,+WI+53528"],
/*DCL NOT INCLUDED*/
["DEE", "12+W+Nelson+St,+Deerfield,+WI+53531"], ["DFT", "203+Library+St,+DeForest,+WI+53532"], ["FCH", "5530+Lacy+Rd,+Fitchburg,+WI+53711"], ["MAR", "605+Waterloo+Rd,+Marshall,+WI+53559"], ["MAZ", "102+Brodhead+St,+Mazomanie,+WI+53560"], ["MCF", "5920+Milwaukee+St,+McFarland,+WI+53558"], ["MID", "7425+Hubbard+Ave,+Middleton,+WI+53562"], ["MOO", "1000+Nichols+Rd,+Monona,+WI+53716"], ["MTH", "105+Perimeter+Rd,+Mount+Horeb,+WI+53572"], ["ORE", "256+Brook+St,+Oregon,+WI+53575"], ["STO", "304+S+4th+St,+Stoughton,+WI+53589"], ["SUN", "1350+Linnerud+Dr,+Sun+Prairie,+WI+53590"], ["VER", "500+Silent+St,+Verona,+WI+53593"], ["WAU", "710+South+St,+Waunakee,+WI+53597"],

// ADAMS COUNTY [27-28]
["ACL", "569+N+Cedar+St,+Adams,+WI+53910"], ["ROM", "1157+Rome+Center+Dr,+Nekoosa,+WI+54457"],

// COLUMBIA COUNTY [29-37]
["CIA", "109+W+Edgewater+St,+Cambria,+WI+53923"], ["COL", "223+W+James+St,+Columbus,+WI+53925"], ["LDI", "130+Lodi+St,+Lodi,+WI+53555"], ["PAR", "119+N+Main+St,+Pardeeville,+WI+53954"], ["POR", "253+W+Edgewater+St,+Portage,+WI+53901"], ["POY", "118+N+Main+St,+Poynette,+WI+53955"], ["RAN", "228+N+High+St+Randolph,+WI+53956"],
//["RIO","324+W+Lyons+St,+Rio,+WI+53960"], ** NON LINK LIBRARY ***
["WID", "620+Elm+St,+Wisconsin+Dells,+WI+53965"], ["WYO", "165+E+Dodge+St,+Wyocena,+WI+53969"],

// GREEN COUNTY [38-40]
//["ALB","200+N+Water+St,+Albany,+WI+53502"], ** NON LINK LIBRARY ***
["BRD", "1207+25th+St,+Brodhead,+WI+53520"], ["MRO", "925+16th+Ave,+Monroe,+WI+53566"],
//["MNT","512+E+Lake+Ave,+Monticello,+WI+53570"], ** NON LINK LIBRARY ***
["NGL", "319+Second+St,+New+Glarus,+WI+53574"],

// PORTAGE COUNTY [41-44]
["ALM", "122+Main+St,+Almond,+WI+54909"],
//["AMH","278+N+Main+St,+Amherst,+WI+54406"], ** NON LINK LIBRARY ***
["PLO", "2151+Roosevelt+Dr,+Plover,+WI+54467"], ["ROS", "137+N+Main+St,+Rosholt,+WI+54473"], ["STP", "1001+Main+St,+Stevens+Point,+WI+54481"],

// SAUK COUNTY [45-53]
["BAR", "230+Fourth+Ave,+Baraboo,+WI+53913"], ["LAV", "101+W+Main+St,+La+Valle,+WI+53941"], ["NOF", "105+N+Maple+St,+North+Freedom,+WI+53951"], ["PLA", "910+Main+St,+Plain,+WI+53577"], ["PDS", "540+Water+St,+Prairie+du+Sac,+WI+53578"], ["REE", "370+Vine+St,+Reedsburg,+WI+53959"], ["RKS", "101+First+St,+Rock+Springs,+WI+53961"], ["SKC", "515+Water+St,+Sauk+City,+WI+53583"], ["SGR", "230+E+Monroe+St,+Spring+Green,+WI+53588"],

// WOOD  [54-65]
["ARP", "8091+County+E,+Arpin,+WI+54410"], ["MCM", "490+E+Grand+Ave,+Wisconsin+Rapids,+WI+54494"]],
    geocoderAPI,
    match = null,
    matchAddr,
    county,
    countySub,
    censusTract,
    zip,
    closestLib = "";

setIcon();
weh.prefs.on("skin", setIcon);

// Load preference-selected function files
function handleUpdated(details) {
  if (details.frameId == 0) {
    // 0 indicates the navigation happens in the tab content window;
    // A positive value indicates navigation in a subframe.
    if (weh.prefs.patronMsg) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/patronMessages.js"
      });
    }
    if (weh.prefs.validAddr) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/validateAddresses.js"
      });
    }
    if (weh.prefs.autoUserId) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/autofillUserId.js"
      });
    }
    if (weh.prefs.selectPSTAT) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/selectPSTAT.js"
      });
    }
    if (weh.prefs.forceDigest) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/forceDigest.js"
      });
    }
    if (weh.prefs.restrictNotificationOptions) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/restrictNotificationOptions.js"
      });
    }
    if (weh.prefs.middleName) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/middleName.js"
      });
    }
    if (weh.prefs.updateAccountType) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/updateAccountType.js"
      });
    }
    if (weh.prefs.collegeExp) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/collegeExp.js"
      });
    }
    if (weh.prefs.disableDropbox) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/disableDropbox.js"
      });
    } else if (day === 0) {
      browser.tabs.executeScript(details.tabId, {
        file: "content/scripts/sundayDropbox.js"
      });
    }
  }
}

browser.webNavigation.onCompleted.addListener(handleUpdated);

weh.ui.update("default", {
  type: "popup",
  onMessage: function onMessage(message) {
    switch (message.type) {
      case "open-settings":
        weh.ui.close("default");
        weh.ui.open("settings");
        break;
      case "addNote":
        weh.ui.close("default");
        browser.tabs.executeScript({
          file: "content/popup-tools/addPaymentPlanNote.js"
        });
        break;
      case "addLostCardNote":
        weh.ui.close("default");
        browser.tabs.executeScript({
          file: "content/popup-tools/addLostCardNote.js"
        });
        break;
      case "addr2PSTAT":
        weh.ui.close("default");
        var querying = browser.tabs.query({ currentWindow: true, active: true });
        querying.then(function (tabs) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = tabs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var tab = _step.value;

              browser.tabs.executeScript(tab.id, {
                code: "x=document.createElement('span');x.id='querySecondaryPSTAT';x.style.display='none';document.body.appendChild(x);"
              });
              if (/^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/.test(tab.url)) {
                browser.tabs.sendMessage(tab.id, { key: "querySecondaryPSTAT" });
              } else {
                browser.tabs.sendMessage(tab.id, { key: "querySecondaryPSTATFail" });
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });
        break;
      case "calendarAnnouncements":
        weh.ui.close("default");
        browser.tabs.create({
          url: "http://host.evanced.info/madison/evanced/eventspr.asp"
        }).then(function (tab) {
          browser.tabs.executeScript({
            file: "/content/popup-tools/calendarAnnouncements.js"
          });
        });
        break;
    }
  }
});

// Handle messages form content pages
function handleMessages(request, sender, sendResponse) {
  switch (request.key) {
    case "queryGeocoder":
      if (request.isSecondPass) {
        geocoderAPI = "https://geocoding.geo.census.gov/geocoder/geographies/address?street=" + request.URIencodedAddress + "&city=" + request.city + "&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=Counties,Census Tracts,County+Subdivisions,2010+Census+ZIP+Code+Tabulation+Areas&format=json";
      } else {
        geocoderAPI = "https://geocoding.geo.census.gov/geocoder/geographies/address?street=" + request.URIencodedAddress + "&city=" + request.city + "&state=wi&benchmark=Public_AR_Current&vintage=Current_Current&layers=Counties,Census Tracts,County+Subdivisions,2010+Census+ZIP+Code+Tabulation+Areas&format=json";
      }
      $.getJSON(geocoderAPI).done(function (response) {
        if (response && response.result) {
          match = response.result;
          if (match) {
            match = match.addressMatches;
            if (match) {
              match = match[0];
              if (match && match !== '') {
                var onError = function onError(error) {
                  console.error("Error: " + error);
                };

                var sendGeocoderResponse = function sendGeocoderResponse(tabs) {
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = tabs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var tab = _step2.value;

                      browser.tabs.sendMessage(tab.id, {
                        key: "receivedGeocoderQuery",
                        hasData: true,
                        matchAddr: matchAddr,
                        county: county,
                        countySub: countySub,
                        censusTract: censusTract,
                        zip: zip
                      });
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                };

                matchAddr = match.matchedAddress.split(',')[0].toUpperCase();
                county = match.geographies.Counties[0].BASENAME;
                countySub = match.geographies['County Subdivisions'][0].NAME;
                censusTract = match.geographies['Census Tracts'][0].BASENAME;
                zip = match['addressComponents'].zip;

                browser.tabs.query({
                  currentWindow: true,
                  active: true
                }).then(sendGeocoderResponse).catch(onError);
              }
            }
          }
        }
      });
      break;
    case "findNearestLib":
      var patronAddr = request.matchAddr4DistQuery,
          region = request.selected,
          mapURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + request.matchAddr4DistQuery + "&destinations=";
      switch (region) {
        case "MPL":
          for (var idx = 0; idx < 8; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[8][1];
          break;
        case "DANE":
          for (var idx = 0; idx < 26; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[26][1];
          break;
        case "ADAMS":
          mapURL += libraryAddresses[27][1] + "|" + libraryAddresses[28][1];
          break;
        case "COLUMBIA":
          for (var idx = 29; idx < 37; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[37][1];
          break;
        case "GREEN":
          for (var idx = 38; idx < 40; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[40][1];
          break;
        case "PORTAGE":
          for (var idx = 41; idx < 44; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[44][1];
          break;
        case "SAUK":
          for (var idx = 45; idx < 53; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[53][1];
          break;
        case "WOOD":
          mapURL += libraryAddresses[54][1] + "|" + libraryAddresses[55][1];
          break;
        case "SCLS":
          for (var idx = 0; idx < 5; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          for (idx = 6; idx < 55; idx++) {
            mapURL += libraryAddresses[idx][1] + "|";
          }
          mapURL += libraryAddresses[55][1];
          break;
        default:
          break;
      }
      $.getJSON(mapURL).done(function (response) {
        if (response) {
          var onError = function onError(error) {
            console.error("Error: " + error);
          };

          var sendMapResponse = function sendMapResponse(tabs) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = tabs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var tab = _step3.value;

                if (closestLib && closestLib != "") {
                  browser.tabs.sendMessage(tab.id, {
                    key: "receivedNearestLib",
                    closestLib: closestLib
                  });
                } else {
                  browser.tabs.sendMessage(tab.id, {
                    key: "failedNearestLib"
                  });
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          };

          var elements = response.rows[0].elements;
          if (elements) {
            switch (region) {
              case "MPL":
                var HPBdist = elements[0].distance.value,
                    MADdist = elements[1].distance.value,
                    HAWdist = elements[2].distance.value,
                    LAKdist = elements[3].distance.value,
                    MEAdist = elements[4].distance.value,
                    MSBdist = elements[5].distance.value,
                    PINdist = elements[6].distance.value,
                    SEQdist = elements[7].distance.value,
                    SMBdist = elements[8].distance.value,
                    minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, MSBdist, PINdist, SEQdist, SMBdist);

                switch (minDist) {
                  case HPBdist:
                    closestLib = "HPB";break;
                  case MADdist:
                    closestLib = "MAD";break;
                  case HAWdist:
                    closestLib = "HAW";break;
                  case LAKdist:
                    closestLib = "LAK";break;
                  case MEAdist:
                    closestLib = "MEA";break;
                  case MSBdist:
                    closestLib = "MSB";break;
                  case PINdist:
                    closestLib = "PIN";break;
                  case SEQdist:
                    closestLib = "SEQ";break;
                  case SMBdist:
                    closestLib = "SMB";break;
                  default:
                    break;
                }
                break;
              case "ADAMS":
                var ACLdist = elements[0].distance.value,
                    ROMdist = elements[1].distance.value,
                    minDist = Math.min(ACLdist, ROMdist);
                switch (minDist) {
                  case ACLdist:
                    closestLib = "ACL";break;
                  case ROMdist:
                    closestLib = "ROM";break;
                  default:
                    break;
                }
                break;
              case "COLUMBIA":
                var CIAdist = elements[0].distance.value,
                    COLdist = elements[1].distance.value,
                    LDIdist = elements[2].distance.value,
                    PARdist = elements[3].distance.value,
                    PORdist = elements[4].distance.value,
                    POYdist = elements[5].distance.value,
                    RANdist = elements[6].distance.value,
                    WIDdist = elements[7].distance.value,
                    WYOdist = elements[8].distance.value,
                    minDist = Math.min(CIAdist, COLdist, LDIdist, PARdist, PORdist, POYdist, RANdist, WIDdist, WYOdist);
                switch (minDist) {
                  case CIAdist:
                    closestLib = "CIA";break;
                  case COLdist:
                    closestLib = "COL";break;
                  case LDIdist:
                    closestLib = "LDI";break;
                  case PARdist:
                    closestLib = "PAR";break;
                  case PORdist:
                    closestLib = "POR";break;
                  case POYdist:
                    closestLib = "POY";break;
                  case RANdist:
                    closestLib = "RAN";break;
                  case WIDdist:
                    closestLib = "WID";break;
                  case WYOdist:
                    closestLib = "WYO";break;
                  default:
                    break;
                }
                break;
              case "DANE":
                var HPBdist = elements[0].distance.value,
                    MADdist = elements[1].distance.value,
                    HAWdist = elements[2].distance.value,
                    LAKdist = elements[3].distance.value,
                    MEAdist = elements[4].distance.value,
                    MSBdist = elements[5].distance.value,
                    PINdist = elements[6].distance.value,
                    SEQdist = elements[7].distance.value,
                    SMBdist = elements[8].distance.value,
                    BLVdist = elements[9].distance.value,
                    BERdist = elements[10].distance.value,
                    CBRdist = elements[11].distance.value,
                    CSPdist = elements[12].distance.value,
                    DEEdist = elements[13].distance.value,
                    DFTdist = elements[14].distance.value,
                    FCHdist = elements[15].distance.value,
                    MARdist = elements[16].distance.value,
                    MAZdist = elements[17].distance.value,
                    MCFdist = elements[18].distance.value,
                    MIDdist = elements[19].distance.value,
                    MOOdist = elements[20].distance.value,
                    MTHdist = elements[21].distance.value,
                    OREdist = elements[22].distance.value,
                    STOdist = elements[23].distance.value,
                    SUNdist = elements[24].distance.value,
                    VERdist = elements[25].distance.value,
                    WAUdist = elements[26].distance.value,
                    minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, MSBdist, PINdist, SEQdist, SMBdist, BLVdist, BERdist, CBRdist, CSPdist, DEEdist, DFTdist, FCHdist, MARdist, MAZdist, MCFdist, MIDdist, MOOdist, MTHdist, OREdist, STOdist, SUNdist, VERdist, WAUdist);

                switch (minDist) {
                  case HPBdist:
                    closestLib = "HPB";break;
                  case MADdist:
                    closestLib = "MAD";break;
                  case HAWdist:
                    closestLib = "HAW";break;
                  case LAKdist:
                    closestLib = "LAK";break;
                  case MEAdist:
                    closestLib = "MEA";break;
                  case MSBdist:
                    closestLib = "MSB";break;
                  case PINdist:
                    closestLib = "PIN";break;
                  case SEQdist:
                    closestLib = "SEQ";break;
                  case SMBdist:
                    closestLib = "SMB";break;
                  case BLVdist:
                    closestLib = "BLV";break;
                  case BERdist:
                    closestLib = "BER";break;
                  case CBRdist:
                    closestLib = "CBR";break;
                  case CSPdist:
                    closestLib = "CSP";break;
                  case DEEdist:
                    closestLib = "DEE";break;
                  case DFTdist:
                    closestLib = "DFT";break;
                  case FCHdist:
                    closestLib = "FCH";break;
                  case MARdist:
                    closestLib = "MAR";break;
                  case MAZdist:
                    closestLib = "MAZ";break;
                  case MCFdist:
                    closestLib = "MCF";break;
                  case MIDdist:
                    closestLib = "MID";break;
                  case MOOdist:
                    closestLib = "MOO";break;
                  case MTHdist:
                    closestLib = "MTH";break;
                  case OREdist:
                    closestLib = "ORE";break;
                  case STOdist:
                    closestLib = "STO";break;
                  case SUNdist:
                    closestLib = "SUN";break;
                  case VERdist:
                    closestLib = "VER";break;
                  case WAUdist:
                    closestLib = "WAU";break;
                  default:
                    break;
                }
                break;
              case "GREEN":
                var BRDdist = elements[0].distance.value,
                    MROdist = elements[1].distance.value,
                    NGLdist = elements[2].distance.value,
                    minDist = Math.min(BRDdist, MROdist, NGLdist);
                switch (minDist) {
                  case BRDdist:
                    closestLib = "BRD";break;
                  case MROdist:
                    closestLib = "MRO";break;
                  case NGLdist:
                    closestLib = "NGL";break;
                  default:
                    break;
                }
                break;
              case "PORTAGE":
                var ALMdist = elements[0].distance.value,
                    PLOdist = elements[1].distance.value,
                    ROSdist = elements[2].distance.value,
                    STPdist = elements[3].distance.value,
                    minDist = Math.min(ALMdist, PLOdist, ROSdist, STPdist);
                switch (minDist) {
                  case ALMdist:
                    closestLib = "ALM";break;
                  case PLOdist:
                    closestLib = "PLO";break;
                  case ROSdist:
                    closestLib = "ROS";break;
                  case STPdist:
                    closestLib = "STP";break;
                  default:
                    break;
                }
                break;
              case "SAUK":
                var BARdist = elements[0].distance.value,
                    LAVdist = elements[1].distance.value,
                    NOFdist = elements[2].distance.value,
                    PLAdist = elements[3].distance.value,
                    PDSdist = elements[4].distance.value,
                    REEdist = elements[5].distance.value,
                    RKSdist = elements[6].distance.value,
                    SKCdist = elements[7].distance.value,
                    SGRdist = elements[8].distance.value,
                    minDist = Math.min(BARdist, LAVdist, NOFdist, PLAdist, PDSdist, REEdist, RKSdist, SKCdist, SGRdist);
                switch (minDist) {
                  case BARdist:
                    closestLib = "BAR";break;
                  case LAVdist:
                    closestLib = "LAV";break;
                  case NOFdist:
                    closestLib = "NOF";break;
                  case PLAdist:
                    closestLib = "PLA";break;
                  case PDSdist:
                    closestLib = "PDS";break;
                  case REEdist:
                    closestLib = "REE";break;
                  case RKSdist:
                    closestLib = "RKS";break;
                  case SKCdist:
                    closestLib = "SKC";break;
                  case SGRdist:
                    closestLib = "SGR";break;
                  default:
                    break;
                }
                break;
              case "WOOD":
                var ARPdist = elements[0].distance.value,
                    MCMdist = elements[1].distance.value,
                    minDist = Math.min(ARPdist, MCMdist);
                switch (minDist) {
                  case ARPdist:
                    closestLib = "ARP";break;
                  case MCMdist:
                    closestLib = "MCM";break;
                  default:
                    break;
                }
                break;
              case "SCLS":
                var HPBdist = elements[0].distance.value,
                    MADdist = elements[1].distance.value,
                    HAWdist = elements[2].distance.value,
                    LAKdist = elements[3].distance.value,
                    MEAdist = elements[4].distance.value,

                //MSBdist = elements[5].distance.value, Arbitrarily exclude MSB to prevent API crash (only 55 elements seem to work)
                PINdist = elements[5].distance.value,
                    SEQdist = elements[6].distance.value,
                    SMBdist = elements[7].distance.value,
                    BLVdist = elements[8].distance.value,
                    BERdist = elements[9].distance.value,
                    CBRdist = elements[10].distance.value,
                    CSPdist = elements[11].distance.value,
                    DEEdist = elements[12].distance.value,
                    DFTdist = elements[13].distance.value,
                    FCHdist = elements[14].distance.value,
                    MARdist = elements[15].distance.value,
                    MAZdist = elements[16].distance.value,
                    MCFdist = elements[17].distance.value,
                    MIDdist = elements[18].distance.value,
                    MOOdist = elements[19].distance.value,
                    MTHdist = elements[20].distance.value,
                    OREdist = elements[21].distance.value,
                    STOdist = elements[22].distance.value,
                    SUNdist = elements[23].distance.value,
                    VERdist = elements[24].distance.value,
                    WAUdist = elements[25].distance.value,
                    ACLdist = elements[26].distance.value,
                    ROMdist = elements[27].distance.value,
                    CIAdist = elements[28].distance.value,
                    COLdist = elements[29].distance.value,
                    LDIdist = elements[30].distance.value,
                    PARdist = elements[31].distance.value,
                    PORdist = elements[32].distance.value,
                    POYdist = elements[33].distance.value,
                    RANdist = elements[34].distance.value,
                    WIDdist = elements[35].distance.value,
                    WYOdist = elements[36].distance.value,
                    BRDdist = elements[37].distance.value,
                    MROdist = elements[38].distance.value,
                    NGLdist = elements[39].distance.value,
                    ALMdist = elements[40].distance.value,
                    PLOdist = elements[41].distance.value,
                    ROSdist = elements[42].distance.value,
                    STPdist = elements[43].distance.value,
                    BARdist = elements[44].distance.value,
                    LAVdist = elements[45].distance.value,
                    NOFdist = elements[46].distance.value,
                    PLAdist = elements[47].distance.value,
                    PDSdist = elements[48].distance.value,
                    REEdist = elements[49].distance.value,
                    RKSdist = elements[50].distance.value,
                    SKCdist = elements[51].distance.value,
                    SGRdist = elements[52].distance.value,
                    ARPdist = elements[53].distance.value,
                    MCMdist = elements[54].distance.value,
                    minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, /*MSBdist, */PINdist, SEQdist, SMBdist, BLVdist, BERdist, CBRdist, CSPdist, DEEdist, DFTdist, FCHdist, MARdist, MAZdist, MCFdist, MIDdist, MOOdist, MTHdist, OREdist, STOdist, SUNdist, VERdist, WAUdist, ACLdist, ROMdist, CIAdist, COLdist, LDIdist, PARdist, PORdist, POYdist, RANdist, WIDdist, WYOdist, BRDdist, MROdist, NGLdist, ALMdist, PLOdist, ROSdist, STPdist, BARdist, LAVdist, NOFdist, PLAdist, PDSdist, REEdist, RKSdist, SKCdist, SGRdist, ARPdist, MCMdist);

                switch (minDist) {
                  case HPBdist:
                    closestLib = "HPB";break;
                  case MADdist:
                    closestLib = "MAD";break;
                  case HAWdist:
                    closestLib = "HAW";break;
                  case LAKdist:
                    closestLib = "LAK";break;
                  case MEAdist:
                    closestLib = "MEA";break;
                  //case MSBdist: closestLib = "MSB"; break; Arbitrarily exclude MSB to prevent API crash (only 55 elements seem to work)
                  case PINdist:
                    closestLib = "PIN";break;
                  case SEQdist:
                    closestLib = "SEQ";break;
                  case SMBdist:
                    closestLib = "SMB";break;
                  case BLVdist:
                    closestLib = "BLV";break;
                  case BERdist:
                    closestLib = "BER";break;
                  case CBRdist:
                    closestLib = "CBR";break;
                  case CSPdist:
                    closestLib = "CSP";break;
                  case DEEdist:
                    closestLib = "DEE";break;
                  case DFTdist:
                    closestLib = "DFT";break;
                  case FCHdist:
                    closestLib = "FCH";break;
                  case MARdist:
                    closestLib = "MAR";break;
                  case MAZdist:
                    closestLib = "MAZ";break;
                  case MCFdist:
                    closestLib = "MCF";break;
                  case MIDdist:
                    closestLib = "MID";break;
                  case MOOdist:
                    closestLib = "MOO";break;
                  case MTHdist:
                    closestLib = "MTH";break;
                  case OREdist:
                    closestLib = "ORE";break;
                  case STOdist:
                    closestLib = "STO";break;
                  case SUNdist:
                    closestLib = "SUN";break;
                  case VERdist:
                    closestLib = "VER";break;
                  case WAUdist:
                    closestLib = "WAU";break;
                  case ACLdist:
                    closestLib = "ACL";break;
                  case ROMdist:
                    closestLib = "ROM";break;
                  case CIAdist:
                    closestLib = "CIA";break;
                  case COLdist:
                    closestLib = "COL";break;
                  case LDIdist:
                    closestLib = "LDI";break;
                  case PARdist:
                    closestLib = "PAR";break;
                  case PORdist:
                    closestLib = "POR";break;
                  case POYdist:
                    closestLib = "POY";break;
                  case RANdist:
                    closestLib = "RAN";break;
                  case WIDdist:
                    closestLib = "WID";break;
                  case WYOdist:
                    closestLib = "WYO";break;
                  case BRDdist:
                    closestLib = "BRD";break;
                  case MROdist:
                    closestLib = "MRO";break;
                  case NGLdist:
                    closestLib = "NGL";break;
                  case ALMdist:
                    closestLib = "ALM";break;
                  case PLOdist:
                    closestLib = "PLO";break;
                  case ROSdist:
                    closestLib = "ROS";break;
                  case STPdist:
                    closestLib = "STP";break;
                  case BARdist:
                    closestLib = "BAR";break;
                  case LAVdist:
                    closestLib = "LAV";break;
                  case NOFdist:
                    closestLib = "NOF";break;
                  case PLAdist:
                    closestLib = "PLA";break;
                  case PDSdist:
                    closestLib = "PDS";break;
                  case REEdist:
                    closestLib = "REE";break;
                  case RKSdist:
                    closestLib = "RKS";break;
                  case SKCdist:
                    closestLib = "SKC";break;
                  case SGRdist:
                    closestLib = "SGR";break;
                  case ARPdist:
                    closestLib = "ARP";break;
                  case MCMdist:
                    closestLib = "MCM";break;
                  default:
                    break;
                }
                break;
              default:
                break;
            }
          }

          browser.tabs.query({
            currentWindow: true,
            active: true
          }).then(sendMapResponse).catch(onError);
        }
      });
      break;
    case "printBarcode":
      browser.tabs.create({
        active: false,
        url: "/printBarcode" + weh.prefs.receiptFont + ".html"
      }).then(function (tab) {
        browser.tabs.sendMessage(tab.id, {
          key: "printBarcode",
          data: request.data
        });
        setTimeout(function () {
          browser.tabs.remove(tab.id);
        }, 1000);
      });
      break;
    case "getDormData":
      $.getJSON("http://mpl-koha-patch.lrschneider.com/dormAddr").done(function (response) {
        var dormName;

        for (var i = 0; i < response.length; i++) {
          var regex = new RegExp(response[i].regex, "i");
          if (regex.test(request.addrVal)) {
            dormName = response[i].name;
            break;
          }
        }

        function onError(error) {
          console.error("Error: " + error);
        }

        function sendMapResponse(tabs) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = tabs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var tab = _step4.value;

              if (dormName && dormName != "") {
                browser.tabs.sendMessage(tab.id, {
                  key: "receivedMatchDorm",
                  dormName: dormName
                });
              } else {
                browser.tabs.sendMessage(tab.id, {
                  key: "failedMatchDorm"
                });
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }

        browser.tabs.query({
          currentWindow: true,
          active: true
        }).then(sendMapResponse).catch(onError);
      });
      break;
    case "getBadAddrs":
      $.getJSON("http://mpl-koha-patch.lrschneider.com/badAddr").done(function (response) {
        var name, type, address, note;

        for (var i = 0; i < response.length; i++) {
          var regex = new RegExp(response[i].regex, "i");
          if (regex.test(request.addrVal)) {
            name = response[i].name;
            type = response[i].type;
            address = response[i].address;
            note = response[i].note;
            break;
          }
        }

        function onError(error) {
          console.error("Error: " + error);
        }

        function sendBadAddrs(tabs) {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = tabs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var tab = _step5.value;

              if (name && type && address) {
                browser.tabs.sendMessage(tab.id, {
                  key: "receivedBadAddrs",
                  name: name,
                  type: type,
                  address: address,
                  note: note
                });
              } else {
                browser.tabs.sendMessage(tab.id, {
                  key: "noBadAddrs"
                });
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }

        browser.tabs.query({
          currentWindow: true,
          active: true
        }).then(sendBadAddrs).catch(onError);
      });
      break;
    case "getPstatByDist":
      var pstatURL = "http://mpl-koha-patch.lrschneider.com/pstats/";
      switch (request.lib) {
        case "Mad":
          pstatURL += "madExceptions";
          break;
        case "Mid":
          pstatURL += "mid";
          break;
        case "Moo":
          pstatURL += "moo";
          break;
        case "Sun":
          pstatURL += "sun";
          break;
        case "Ver":
          pstatURL += "ver";
          break;
      }
      pstatURL += "?val=all&regex=true";

      $.getJSON(pstatURL).done(function (response) {
        var value, zip, tract;

        for (var i = 0; i < response.length; i++) {
          var regex = new RegExp(response[i].regex, "i");
          if (regex.test(request.addrVal)) {
            tract = !!request.tract ? request.tract : response[i].value;
            zip = response[i].zip;
            break;
          }
        }

        function onError(error) {
          console.error("Error: " + error);
        }

        function sendPSTAT(tabs) {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = tabs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var tab = _step6.value;

              if (value && request.lib === "mad") {
                browser.tabs.sendMessage(tab.id, {
                  key: "receivedMadException",
                  value: value,
                  zip: zip
                });
              } else if (value && /m(id|oo)|ver|sun/i.test(request.lib)) {
                browser.tabs.sendMessage(tab.id, {
                  key: "received" + request.lib + "PSTAT",
                  value: value
                });
              } else {
                browser.tabs.sendMessage(tab.id, {
                  key: "noPstatByDist"
                });
              }
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }
        }

        browser.tabs.query({
          currentWindow: true,
          active: true
        }).then(sendPSTAT).catch(onError);
      });
      break;
  }
}

browser.runtime.onMessage.addListener(handleMessages);

weh.ui.update("settings", {
  type: "tab",
  contentURL: "content/settings.html"
});
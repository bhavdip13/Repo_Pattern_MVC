var bingUrl = 'https://dev.virtualearth.net/REST/v1/Locations/';
var bingKey = ' ArWToRqk4QeworHYLypL3Xi7lOghwqGlduv_SDP8bD79uBxBoj5gcvhZARgQRGkN';
var googleGeocodingApiBaseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
var googleApiKey = 'AIzaSyDnvfgSHFSmKDoHOYFhZ6dCuag7wAMqv18';
var verifyReciAddReq1 = 'https://maps-api-ssl.google.com/maps/api/geocode/';
var calcMilesReq1 = 'https://maps.googleapis.com/maps/api/distancematrix/';
var seperator = ' ';
var currUserId, userShopList, userShopEmployeesList, userShopDefaults, userDriverList, userCashRegistryList, allPaymentModes,
    userPaymentModes, allRecurringFrequencies, userShortCodes, userSourceCodes, userTaxTypes, allWireInTypes, allWireOutTypes,
    userRequiredFields, userZones, allOccasions, userOccasionQuotesList, userFuneralLogs, allLocations, allCountries,
    userCommonAddresses, userDrafts, userItems, userDraftItems, userDefaultMsg, loggedInUserData, creditDebit, milebaseddelivery, zonebaseddelivery,
    defaultbaseddeliveryfee, holydaydelfee, zipcodedelfee, citydelfee, relaydelfee, transferShopList, holidayslist, hinturlList, MVCMenuList, MenuList, canadaTaxList,
    TimeZoneList;


// to show: showBlockScreen('tab-1')
// to hide: $('#tab-1').unblock()
function showBlockScreen(controlId) {
    $('#' + controlId).block({
        message: '<div class="sk-spinner sk-spinner-cube-grid">    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div>    <div class="sk-cube"></div></div>',
        css: {
            border: '0 none;',
            backgroundColor: 'transparent !important;'
        }
    });
}
function ManageLoader(divId) {
    var activeAjaxCallCount = $('#' + divId).data('activeajaxcalls');
    //console.log(divId + ' active ajax calls: ' + activeAjaxCallCount);
    if (activeAjaxCallCount >= 1) {
        if ($("#" + divId).data('overlay') == undefined || $("#" + divId).data('overlay') == false) {
            showBlockScreen(divId);
        }
        $("#" + divId).data('overlay', true);
    }
    if (activeAjaxCallCount <= 0) {
        $('#' + divId).unblock();
        $("#" + divId).data('overlay', false);
        $('#' + divId).data('activeajaxcalls', '0');
    }
}
function IncreaseAjaxCount(divIdToBlock) {
    if (!divIdToBlock || divIdToBlock == undefined) {
        divIdToBlock = 'wrapper';
    }
    var activeAjaxCallCount = $('#' + divIdToBlock).data('activeajaxcalls');
    if (isNaN(activeAjaxCallCount)) {
        activeAjaxCallCount = 0;
        //console.log(divIdToBlock + ' setting it to zero while increasing');
    }
    $('#' + divIdToBlock).data('activeajaxcalls', ++activeAjaxCallCount);
    ManageLoader(divIdToBlock);
}
function DecreaseAjaxCount(divIdToBlock) {
    if (!divIdToBlock || divIdToBlock == undefined) {
        divIdToBlock = 'wrapper';
    }
    var activeAjaxCallCount = $('#' + divIdToBlock).data('activeajaxcalls');
    if (isNaN(activeAjaxCallCount)) {
        //console.log(divIdToBlock + ' setting it to zero while decreasing');
        activeAjaxCallCount = 0;
    }
    $('#' + divIdToBlock).data('activeajaxcalls', --activeAjaxCallCount);
    ManageLoader(divIdToBlock);
}
function getRootUrl() {
    return window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host + '/';
}
//Functions
//refreshData is a boolean variable, set true, to enable ajax calls for data refresh
function reloadOtherData(refreshData) {
    getShopDetailsForCurrUser(refreshData);
    if (refreshData) {
        getAllNeededDataInSingleAjax();
    }
    else {
        getShopEmployeesForCurrUser(refreshData);
        getShopDefaultForCurrUser(refreshData);
        getDriversForCurrUser(refreshData);
        getCashRegistryForCurrUser(refreshData);
        getAllPaymentModes(refreshData);
        getShopPaymentModesForCurrUser(refreshData);
        getAllRecurringFrequencies(refreshData);
        getAllShortCodesForCurrUser(refreshData);
        getAllSourceCodesForCurrUser(refreshData);
        getAllTaxTypesForCurrUser(refreshData);
        getAllWireInTypes(refreshData);
        geAllWireOutTypes(refreshData);
        getAllShopRequiredFieldsForCurrUser(refreshData);
        getAllOccasions(refreshData);
        getOccasionsQuotesForCurrUser(refreshData);
        getAllZonesForCurrUser(refreshData);
        getAllFuneralLogsForCurrUser(refreshData);
        getAllLocations(refreshData);
        getAllCountries(refreshData);
        getAllCommonAddressesForCurrUser(refreshData);
        getAllDraftsForCurrUser(refreshData);
        getAllItemsForCurrUser(refreshData);
        getAllDefaultWireMsgForCurrUser(refreshData);
        getCreditDebitReasonForCurrUser(refreshData);
        getTransferShopDetailsForCurrUser(refreshData);
        getAllCanadaTaxList(refreshData);
    }
}
function reloadUserSettings(refreshData) {
    //  if (refreshData == true)
    //  {
    refreshData = getCurrUser(true);
    reloadOtherData(refreshData);
    //  }
}
//Shop Related Functions
function getShopDetailsByShopId(shopId) {
    var shopDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getShopDetailsForCurrUser();
        if (parseVariable(userShopList, true)) {
            var selectedShopDetails = $.grep(userShopList, function (obj, idx) {
                return (String(obj.SHOP_CODE) == String(shopId));
            });
            if (selectedShopDetails.length > 0) {
                shopDetails = selectedShopDetails[0];
            }
        }
    }
    return shopDetails;
}
function getShopIdNameListForCurrUser(hasMultiple) {
    var shopIdNameList = [];
    getShopDetailsForCurrUser();
    if (parseVariable(userShopList, true)) {
        var defaultId = "--select--";
        var defaultValue = "--Select Shop--";
        if (parseVariable(hasMultiple) && hasMultiple.toLowerCase() == 'multiple') {
            defaultValue = "All";
            defaultId = userShopList.map(function (obj) {
                return obj.SHOP_CODE;
            }).join(",");
        }
        var defaultObj = {
            Id: defaultId, Value: defaultValue
        };
        userShopList.forEach(function (obj, idx) {
            shopIdNameList.push({
                Id: obj.SHOP_CODE, Value: obj.SHOP_NAME
            });
        });
        if (shopIdNameList.length > 1) {
            shopIdNameList.insert(0, defaultObj);
        }
    }
    return shopIdNameList;
}
//Shop Employees Related Functions
function getShopEmployeesIdNameByShopId(shopId, type) {
    var employeeIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select User--", IsEnabled: "Yes"
        };
        getShopEmployeesForCurrUser();
        if (parseVariable(userShopEmployeesList, true)) {
            var datalist = userShopEmployeesList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userShopEmployeesList, function (obj, idx) {
                    return (String(obj.Shop_Id) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var userType = '';
                if (parseVariable(type)) {
                    userType = type.toLowerCase();
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (userType == 'designer' && parseVariable(obj.IsDesigner) && validateUserTypeColumn(obj.IsDesigner)) {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    else if (userType == 'driver' && parseVariable(obj.IsDriver) && validateUserTypeColumn(obj.IsDriver)) {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    else if (userType == 'storehelper' && parseVariable(obj.IsStoreHelp) && validateUserTypeColumn(obj.IsStoreHelp)) {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    else if (userType == 'manager' && parseVariable(obj.IsManager) && validateUserTypeColumn(obj.IsManager)) {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    else if (userType == 'salesrep' && parseVariable(obj.IsSalesRep) && validateUserTypeColumn(obj.IsSalesRep)) {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    else if (userType == '') {
                        idNameObj = {
                            Id: obj.EMPLOYEE_ID, Value: obj.EMPNAME, IsEnabled: obj.FLAG
                        };
                    }
                    if (idNameObj != undefined)
                        employeeIdNameList.push(idNameObj);
                });
            }
        }
        if (employeeIdNameList.length > 1) {
            employeeIdNameList.insert(0, defaultObj);
        }
    }
    return employeeIdNameList;
}
function validateUserTypeColumn(column) {
    var result = false;
    if (typeof column == "string" && column.trim().toLowerCase() == 'yes') {
        result = true;
    }
    else if (typeof column == "boolean" && column == true) {
        result = true;
    }
    return result;
}
//Shop Defaults Related Methods
function getShopDefaultsByShopId(shopId) {
    var shopDefaults;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getShopDefaultForCurrUser();
        if (parseVariable(userShopDefaults, true)) {
            var selectedShopDefaults = $.grep(userShopDefaults, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (selectedShopDefaults.length > 0) {
                shopDefaults = selectedShopDefaults[0];
            }
        }
    }
    return shopDefaults;
}
//Drivers Related Methods
function getDriverDetailsByShopId(shopId, flagValue) {
    var driversList = [];
    if (parseVariable(shopId)) {
        getDriversForCurrUser();
        if (parseVariable(userDriverList, true)) {
            var datalist = userDriverList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userDriverList, function (obj, idx) {
                    return (String(obj.SHOP_ID) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var flag = '';
                if (parseVariable(flagValue)) {
                    flag = flagValue;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (flag == true && parseVariable(obj.EnableFlg) && validateDriverFlgColumn(obj.EnableFlg, true)) {
                        idNameObj = obj;
                    }
                    else if (flag == false && parseVariable(obj.EnableFlg) && validateDriverFlgColumn(obj.EnableFlg, false)) {
                        idNameObj = obj;
                    }
                    else if (flag == undefined || flag == null || flag === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        driversList.push(idNameObj);
                });
            }
        }
    }
    return driversList;
}
function getDriverIDNameByShopId(shopId, flagValue) {
    var driversList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Driver--", Initial: ''
        };
        getDriversForCurrUser();
        if (parseVariable(userDriverList, true)) {
            var datalist = userDriverList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userDriverList, function (obj, idx) {
                    return (String(obj.SHOP_ID) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var flag = '';
                if (parseVariable(flagValue)) {
                    flag = flagValue;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (flag == true && parseVariable(obj.EnableFlg) && validateDriverFlgColumn(obj.EnableFlg, true)) {
                        idNameObj = {
                            Id: obj.Driver_id, Value: obj.DriverName, Initial: obj.Driver_initials
                        };
                    }
                    else if (flag == false && parseVariable(obj.EnableFlg) && validateDriverFlgColumn(obj.EnableFlg, false)) {
                        idNameObj = {
                            Id: obj.Driver_id, Value: obj.DriverName, Initial: obj.Driver_initials
                        };
                    }
                    else if (flag == undefined || flag == null || flag === '') {
                        idNameObj = {
                            Id: obj.Driver_id, Value: obj.DriverName, Initial: obj.Driver_initials
                        };
                    }
                    if (idNameObj != undefined)
                        driversList.push(idNameObj);
                });
            }
            if (driversList.length > 1) {
                driversList.insert(0, defaultObj);
            }
        }
    }
    return driversList;
}
function validateDriverFlgColumn(column, flagState) {
    var result = false;
    if (typeof column == "string") {
        if (flagState == true) {
            if (column.trim().toLowerCase() == 'yes' || column.trim().toLowerCase() == 'y') {
                result = true;
            }
        }
        else {
            if (column.trim().toLowerCase() == 'no' || column.trim().toLowerCase() == 'n') {
                result = true;
            }
        }
    }
    else if (typeof column == "boolean" && column == flagState) {
        result = true;
    }
    return result;
}
//Cash Registry Related Methods
function getCashRegistryByShopId(shopId) {
    var cashRegistryDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getCashRegistryForCurrUser();
        if (parseVariable(userCashRegistryList, true)) {
            var selectedCashRegistryDetails = $.grep(userCashRegistryList, function (obj, idx) {
                return (String(obj.ShopID) == String(shopId));
            });
            if (selectedCashRegistryDetails.length > 0) {
                cashRegistryDetails = selectedCashRegistryDetails;
            }
        }
    }
    return cashRegistryDetails;
}
function getCashRegistryIdNameByShopId(shopId) {
    var crIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Cash Registry--"
        };
        getCashRegistryForCurrUser();
        if (parseVariable(userCashRegistryList, true)) {
            var datalist = userCashRegistryList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userCashRegistryList, function (obj, idx) {
                    return (String(obj.ShopID) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                datalist.forEach(function (obj, idx) {
                    var idNameObj = {
                        Id: obj.ClerkID, Value: obj.ClerkDesc
                    };
                    if (idNameObj != undefined)
                        crIdNameList.push(idNameObj);
                });
            }
        }
        if (crIdNameList.length > 1) {
            crIdNameList.insert(0, defaultObj);
        }
    }
    return crIdNameList;
}
//Payment Modes Related Methods
function getPaymentModesIdName() {
    var payments = [];
    getAllPaymentModes();
    if (parseVariable(allPaymentModes, true)) {
        var defaultObj = { Id: '--select--', Value: "--Select Payment Type--" };
        allPaymentModes.forEach(function (obj, idx) {
            payments.push({
                Id: obj.PaymentCode, Value: obj.PaymentLabel
            });
        });
        if (payments.length > 1) {
            payments.insert(0, defaultObj);
        }
    }
    return payments;
}
//Shop Payment Modes Related Methods
function getPaymentModesIdNameByShopId(shopId, requiredFlag) {
    var paymentModesList = [];
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getShopPaymentModesForCurrUser();
        if (parseVariable(userPaymentModes, true)) {
            var datalist = userPaymentModes;
            datalist = $.grep(userPaymentModes, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (datalist.length > 0) {
                var flag = '';
                if (parseVariable(requiredFlag)) {
                    flag = requiredFlag;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (flag == true && parseVariable(obj.isRequired) && validatePaymentModeFlgColumn(obj.isRequired, true)) {
                        idNameObj = {
                            Id: obj.PaymentCode, Value: obj.isRequired
                        };
                    }
                    else if (flag == false && parseVariable(obj.isRequired) && validatePaymentModeFlgColumn(obj.isRequired, false)) {
                        idNameObj = {
                            Id: obj.PaymentCode, Value: obj.isRequired
                        };
                    }
                    else if (flag == undefined || flag == null || flag === '') {
                        idNameObj = {
                            Id: obj.PaymentCode, Value: obj.isRequired
                        };
                    }
                    if (idNameObj != undefined)
                        paymentModesList.push(idNameObj);
                });
            }
        }
    }
    return paymentModesList;
}
function validatePaymentModeFlgColumn(column, flagState) {
    var result = false;
    if (typeof column == "string") {
        if (flagState == true) {
            if (column.trim().toLowerCase() == 'yes' || column.trim().toLowerCase() == 'y') {
                result = true;
            }
        }
        else {
            if (column.trim().toLowerCase() == 'no' || column.trim().toLowerCase() == 'n') {
                result = true;
            }
        }
    }
    else if (typeof column == "boolean" && column == flagState) {
        result = true;
    }
    return result;
}
//Recurring Frequency Related Methods
function getRecurringFrequenciesDetails() {
    var recurringFrequenciesDetails;
    getAllRecurringFrequencies();
    if (parseVariable(allRecurringFrequencies, true)) {
        var selectedRecurringFrequenciesDetails = allRecurringFrequencies;
        if (selectedRecurringFrequenciesDetails.length > 0) {
            recurringFrequenciesDetails = selectedRecurringFrequenciesDetails;
        }
    }
    return recurringFrequenciesDetails;
}
function getRecurringFrequencyIdNameList(hasMultiple) {
    var RecurringFrequencyIdNameList = [];
    getAllRecurringFrequencies();
    if (parseVariable(allRecurringFrequencies, true)) {
        var defaultId = "--select--";
        var defaultValue = "-- Select Recurring Frequency--";
        if (parseVariable(hasMultiple) && hasMultiple.toLowerCase() == 'multiple') {
            defaultValue = "All";
            defaultId = allRecurringFrequencies.map(function (obj) {
                return obj.ID;
            }).join(",");
        }
        var defaultObj = {
            Id: defaultId, Value: defaultValue
        };
        allRecurringFrequencies.forEach(function (obj, idx) {
            RecurringFrequencyIdNameList.push({
                Id: obj.RecurringValue, Value: obj.RecurringFrequency
            });
        });
        if (RecurringFrequencyIdNameList.length > 1) {
            RecurringFrequencyIdNameList.insert(0, defaultObj);
        }
    }
    return RecurringFrequencyIdNameList;
}
//Shop Short Codes Related Methods
function getShortCodesByShopId(shopId) {
    var userShortCodesDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllShortCodesForCurrUser();
        if (parseVariable(userShortCodes, true)) {
            var selectedShortCodeDetails = $.grep(userShortCodes, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (selectedShortCodeDetails.length > 0) {
                userShortCodesDetails = selectedShortCodeDetails;
            }
        }
    }
    return userShortCodesDetails;
}
function getShortCodesIdNameListByShopId(shopId) {
    var userShortCodesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Shortcode--"
        };
        getAllShortCodesForCurrUser();
        if (parseVariable(userShortCodes, true)) {
            var datalist = userShortCodes;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userShortCodes, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                datalist.forEach(function (obj, idx) {
                    userShortCodesIdNameList.push({
                        Id: obj.ShortCode, Value: obj.ShortCodeDesc
                    });
                });
            }
            //if (userShortCodesIdNameList.length > 1) {
            //    userShortCodesIdNameList.insert(0, defaultObj);
            //}
        }
    }
    return userShortCodesIdNameList;
}
//Shop Source Codes Related Methods
function getSourceCodesByShopId(shopId) {
    var userSourceCodesDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllSourceCodesForCurrUser();
        if (parseVariable(userSourceCodes, true)) {
            var selectedSourceCodes = $.grep(userSourceCodes, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (selectedSourceCodes.length > 0) {
                userSourceCodesDetails = selectedSourceCodes;
            }
        }
    }
    return userSourceCodesDetails;
}
function getSourceCodesIdNameListByShopId(shopId) {
    var userSourceCodesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Source--"
        };
        getAllSourceCodesForCurrUser();
        if (parseVariable(userSourceCodes, true)) {
            var datalist = userSourceCodes;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userSourceCodes, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                datalist.forEach(function (obj, idx) {
                    userSourceCodesIdNameList.push({
                        Id: obj.ID, Value: obj.SourceLabel
                    });
                });
            }
            if ((userSourceCodesIdNameList.length > 1) || (userSourceCodesIdNameList.length == 0)) {
                userSourceCodesIdNameList.insert(0, defaultObj);
            }
        }
    }
    return userSourceCodesIdNameList;
}
//Shop Taxes Related Methods
function getTaxTypesByShopId(shopId) {
    var userTaxTypesDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllTaxTypesForCurrUser();
        if (parseVariable(userTaxTypes, true)) {
            var selectedTaxTypes = $.grep(userTaxTypes, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (selectedTaxTypes.length > 0) {
                userTaxTypesDetails = selectedTaxTypes;
            }
        }
    }
    return userTaxTypesDetails;
}
function getTaxTypesIdNameListByShopId(shopId) {
    var userTaxTypesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Tax Type--", percentage: "", isDefault: ""
        };
        getAllTaxTypesForCurrUser();
        if (parseVariable(userTaxTypes, true)) {
            var datalist = userTaxTypes;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userTaxTypes, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                datalist.forEach(function (obj, idx) {
                    var GSTPercent = obj.GSTPercent;
                    var PSTPercent = obj.PSTPercent;
                    if (GSTPercent == null || GSTPercent == '' || GSTPercent == undefined) {
                        GSTPercent = '0';
                    }
                    if (PSTPercent == null || PSTPercent == '' || PSTPercent == undefined) {
                        PSTPercent = '0';
                    }
                    userTaxTypesIdNameList.push({
                        Id: obj.TaxCode,
                        Value: obj.TaxName,
                        percentage: obj.TaxPercent,
                        isDefault: obj.isDefault,
                        GSTpercentage: GSTPercent,
                        PSTpercentage: PSTPercent,
                        CalGSTFlg: obj.CalGSTflg,
                        CalPSTFlg: obj.CalPSTflg,
                        CalHSTFlg: obj.CalHSTflg,
                        CalQSTFlg: obj.CalQSTflg,
                    });
                });
            }
            if (userTaxTypesIdNameList.length > 1) {
                userTaxTypesIdNameList.insert(0, defaultObj);
            }
        }
    }
    return userTaxTypesIdNameList;
}
//Wire In Types Related Methods
function getWireInTypesList() {
    var allWireInTypes;
    getAllWireInTypes();
    if (parseVariable(allWireInTypes, true)) {
        var selectedWireInTypes = allWireInTypes;
        if (selectedWireInTypes.length > 0) {
            allWireInTypes = selectedWireInTypes;
        }
    }
    return allWireInTypes;
}
function getWireInTypesIdNameList() {
    var userWireInTypesIdNameList = [];
    var defaultObj = {
        Id: "--select--", Value: "--Select WireIn Type--"
    };
    getAllWireInTypes();
    if (parseVariable(allWireInTypes, true)) {
        var datalist = allWireInTypes;
        if (datalist.length > 0) {
            datalist.forEach(function (obj, idx) {
                userWireInTypesIdNameList.push({
                    Id: obj.WireInCode, Value: obj.WireInLabel
                });
            });
        }
        if (userWireInTypesIdNameList.length > 1) {
            userWireInTypesIdNameList.insert(0, defaultObj);
        }
    }
    return userWireInTypesIdNameList;
}
//Wire Out Types Related Methods
function getWireOutTypesList() {
    var allWireOutTypes;
    geAllWireOutTypes();
    if (parseVariable(allWireOutTypes, true)) {
        var selectedWireOutTypes = allWireOutTypes;
        if (selectedWireOutTypes.length > 0) {
            allWireOutTypes = selectedWireOutTypes;
        }
    }
    return allWireOutTypes;
}
function getWireOutTypesIdNameList() {
    var userWireOutTypesIdNameList = [];
    var defaultObj = {
        Id: "--select--", Value: "--Select WireOut Type--"
    };
    geAllWireOutTypes();
    if (parseVariable(allWireOutTypes, true)) {
        var datalist = allWireOutTypes;
        if (datalist.length > 0) {
            datalist.forEach(function (obj, idx) {
                userWireOutTypesIdNameList.push({
                    Id: obj.WireOutCode, Value: obj.WireOutLabel
                });
            });
        }
        if (userWireOutTypesIdNameList.length > 1) {
            userWireOutTypesIdNameList.insert(0, defaultObj);
        }
    }
    return userWireOutTypesIdNameList;
}
//Shop Required Fields Related Methods
function getRequiredFieldsByShopId(shopId) {
    var userRequiredFieldsDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllShopRequiredFieldsForCurrUser();
        if (parseVariable(userRequiredFields, true)) {
            var selectedRequiredFields = $.grep(userRequiredFields, function (obj, idx) {
                return (String(obj.ShopId) == String(shopId));
            });
            if (selectedRequiredFields.length > 0) {
                userRequiredFieldsDetails = selectedRequiredFields;
            }
        }
    }
    return userRequiredFieldsDetails;
}
function getRequiredFieldsIdNameListByShopId(shopId, requiredFlag) {
    var userRequiredFieldsIdNameList = [];
    if (parseVariable(shopId)) {
        getAllShopRequiredFieldsForCurrUser();
        if (parseVariable(userRequiredFields, true)) {
            var datalist = userRequiredFields;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userRequiredFields, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var flag = '';
                if (parseVariable(requiredFlag)) {
                    flag = requiredFlag;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (flag == true && parseVariable(obj.isRequired) && validateRequiredFieldFlgColumn(obj.isRequired, true)) {
                        idNameObj = {
                            Id: obj.fieldName, Value: obj.isRequired
                        };
                    }
                    else if (flag == false && parseVariable(obj.isRequired) && validateRequiredFieldFlgColumn(obj.isRequired, false)) {
                        idNameObj = {
                            Id: obj.fieldName, Value: obj.isRequired
                        };
                    }
                    else if (flag == undefined || flag == null || flag === '') {
                        idNameObj = {
                            Id: obj.fieldName, Value: obj.isRequired
                        };
                    }
                    if (idNameObj != undefined)
                        userRequiredFieldsIdNameList.push(idNameObj);
                });
            }
        }
    }
    return userRequiredFieldsIdNameList;
}
function validateRequiredFieldFlgColumn(column, flagState) {
    var result = false;
    if (typeof column == "string") {
        if (flagState == true) {
            if (column.trim().toLowerCase() == 'yes' || column.trim().toLowerCase() == 'y') {
                result = true;
            }
        }
        else {
            if (column.trim().toLowerCase() == 'no' || column.trim().toLowerCase() == 'n') {
                result = true;
            }
        }
    }
    else if (typeof column == "boolean" && column == flagState) {
        result = true;
    }
    return result;
}
//Shop Zones Related Methods
function getZonesByShopId(shopId) {
    var userZoneDetails;
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllShopRequiredFieldsForCurrUser();
        if (parseVariable(userZones, true)) {
            var selectedZones = $.grep(userZones, function (obj, idx) {
                return (String(obj.SHOP_CODE) == String(shopId));
            });
            if (selectedZones.length > 0) {
                userZoneDetails = selectedZones;
            }
        }
    }
    return userZoneDetails;
}
function getZonesIdNameListByShopId(shopId, refreshData) {
    var userZonesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Zone--", ZoneFee: ""
        };
        getAllZonesForCurrUser(refreshData);
        if (parseVariable(userZones, true)) {
            var datalist = userZones;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userZones, function (obj, idx) {
                    return (String(obj.SHOP_CODE) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                datalist.forEach(function (obj, idx) {
                    var idNameObj = {
                        Id: obj.Zone_Id, Value: obj.ZoneName, ZoneFee: obj.ZoneFee
                    };
                    if (idNameObj != undefined)
                        userZonesIdNameList.push(idNameObj);
                });
            }
            if (userZonesIdNameList.length > 1) {
                userZonesIdNameList.insert(0, defaultObj);
            }
        }
    }
    return userZonesIdNameList;
}
//Occasion Related Methods
function getOccasionDetails() {
    var allOccasionsList;
    getAllOccasions();
    if (parseVariable(allOccasions, true)) {
        var selectedOccasions = allOccasions;
        if (selectedOccasions.length > 0) {
            allOccasionsList = selectedOccasions;
        }
    }
    return allOccasionsList;
}
function getOccasionsIdNameList() {
    var occassionIdNameList = [];
    var defaultObj = {
        Id: "--select--", Value: "--Choose Occasion--", Msg: ""
    };
    getAllOccasions();
    if (parseVariable(allOccasions, true)) {
        var datalist = allOccasions;
        if (datalist.length > 0) {
            datalist.forEach(function (obj, idx) {
                occassionIdNameList.push({
                    Id: obj.OccasionID, Value: obj.OccasionDesc, Msg: obj.Default_Msg
                });
            });
        }
        if (occassionIdNameList.length > 1) {
            occassionIdNameList.insert(0, defaultObj);
        }
    }
    return occassionIdNameList;
}
//Funeral Log Related Methods
function getFuneralLogsByShopId(shopId, funeralLogId) {
    var userFuneralLogsList = [];

    if (parseVariable(shopId)) {
        getAllFuneralLogsForCurrUser(true);
        if (parseVariable(userFuneralLogs, true)) {
            var datalist = userFuneralLogs;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userFuneralLogs, function (obj, idx) {
                    // return (String(obj.SHOP_ID) == String(shopId) && (new Date(parseInt(obj.DEL_DATE.substr(6))).toLocaleDateString()) == (new Date().toLocaleDateString()));
                    // return (String(obj.SHOP_ID) == String(shopId) && (new Date(obj.DEL_DATE)) >= (new Date()));
                    return (String(obj.SHOP_ID) == String(shopId) && (new Date(obj.DEL_DATE)) >= (new Date(new Date().setHours(0, 0, 0, 0))));
                });
            }
            if (datalist.length > 0) {
                var funeralLogIdValue = '';
                if (parseVariable(funeralLogId)) {
                    funeralLogIdValue = funeralLogId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(funeralLogIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(funeralLogIdValue)) {
                        idNameObj = obj;
                    }
                    else if (funeralLogIdValue == undefined || funeralLogIdValue == null || funeralLogIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        userFuneralLogsList.push(idNameObj);
                });
            }
        }
    }
    return userFuneralLogsList;
}
function getFuneralLogsIdNameListByShopId(shopId, funeralLogId) {
    var userFuneralLogsIdNameList = [];



    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Funeral Log--"
        };
        getAllFuneralLogsForCurrUser();
        if (parseVariable(userFuneralLogs, true)) {
            var datalist = userFuneralLogs;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userFuneralLogs, function (obj, idx) {
                    return (String(obj.SHOP_ID) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var funeralLogIdValue = '';
                if (parseVariable(funeralLogId)) {
                    funeralLogIdValue = funeralLogId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(funeralLogIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(funeralLogIdValue)) {
                        idNameObj = {
                            Id: obj.ID, Value: obj.FuneralLogName
                        };
                    }
                    else if (funeralLogIdValue == undefined || funeralLogIdValue == null || funeralLogIdValue === '') {
                        idNameObj = {
                            Id: obj.ID, Value: obj.FuneralLogName
                        };
                    }
                    if (idNameObj != undefined)
                        userFuneralLogsIdNameList.push(idNameObj);
                });
            }
            if (userFuneralLogsIdNameList.length > 0) {
                userFuneralLogsIdNameList.insert(0, defaultObj);
            }
        }
    }
    return userFuneralLogsIdNameList;
}
//Shop Occasion Quotes Related Methods
function getOccasionQuotesByShopId(shopId, occasionId) {
    var occasionQuotesList = [];
    if (parseVariable(shopId)) {
        getOccasionsQuotesForCurrUser();
        if (parseVariable(userOccasionQuotesList, true)) {
            var datalist = userOccasionQuotesList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userOccasionQuotesList, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var occasionIdValue = '';
                if (parseVariable(occasionId)) {
                    occasionIdValue = occasionId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(occasionIdValue) && parseVariable(obj.OccasionID) && String(obj.OccasionID) == String(occasionIdValue)) {
                        idNameObj = obj;
                    }
                    else if (occasionIdValue == undefined || occasionIdValue == null || occasionIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        occasionQuotesList.push(idNameObj);
                });
            }
        }
    }
    return occasionQuotesList;
}
function getOccasionQuotesIdNameListByShopId(shopId, occasionId) {
    var occasionQuotesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Sugguestions--"
        };
        getOccasionsQuotesForCurrUser();
        if (parseVariable(userOccasionQuotesList, true)) {
            var datalist = userOccasionQuotesList;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userOccasionQuotesList, function (obj, idx) {
                    return (String(obj.ShopId) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var occasionIdValue = '';
                if (parseVariable(occasionId)) {
                    occasionIdValue = occasionId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(occasionIdValue) && parseVariable(obj.OccasionID) && String(obj.OccasionID) == String(occasionIdValue)) {
                        idNameObj = {
                            Id: obj.ID, Value: obj.Quote
                        };
                    }
                    else if (occasionIdValue == undefined || occasionIdValue == null || occasionIdValue === '') {
                        idNameObj = {
                            Id: obj.ID, Value: obj.Quote
                        };
                    }
                    if (idNameObj != undefined)
                        occasionQuotesIdNameList.push(idNameObj);
                });
            }
            if (occasionQuotesIdNameList.length > 0) {
                occasionQuotesIdNameList.insert(0, defaultObj);
            }
        }
    }
    return occasionQuotesIdNameList;
}
//Location Related Methods
function geAllLocationsIdNameList() {
    var locationsIdNameList = [];
    var defaultObj = {
        Id: "--select--", Value: "--Select Location--"
    };
    //getAllLocations(true);
    getAllLocations();
    if (parseVariable(allLocations, true)) {
        var datalist = allLocations;
        if (datalist.length > 0) {
            datalist.forEach(function (obj, idx) {
                locationsIdNameList.push({
                    Id: obj.ID, Value: obj.NAME
                });
            });
        }
        if (locationsIdNameList.length > 1) {
            locationsIdNameList.insert(0, defaultObj);
        }
    }
    return locationsIdNameList;
}
//All Countries Related Methods
function getAllCountriesDetails() {
    var allCountriesList;
    getAllCountries();
    if (parseVariable(allCountries, true)) {
        var selectedCountries = allCountries;
        if (selectedCountries.length > 0) {
            allCountriesList = selectedCountries;
        }
    }
    return allCountriesList;
}
function getAllCountriesIdNameList() {
    var countriesIdNameList = [];
    var defaultObj = {
        Id: "--select--", Value: "--Select Country--"
    };
    getAllCountries();
    if (parseVariable(allCountries, true)) {
        var datalist = allCountries;
        if (datalist.length > 0) {
            datalist.forEach(function (obj, idx) {
                countriesIdNameList.push({ Id: obj.Country_Value, Value: obj.Country_Name });
            });
        }
        if (countriesIdNameList.length > 1) {
            countriesIdNameList.insert(0, defaultObj);
        }
    }
    return countriesIdNameList;
}
//User Common Addresses Related Methods
function getCommonAddressesByShopId(shopId, commonaddressId) {
    var userCommonAddressesList = [];
    if (parseVariable(shopId)) {
        getAllCommonAddressesForCurrUser();
        if (parseVariable(userCommonAddresses, true)) {
            var datalist = userCommonAddresses;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userCommonAddresses, function (obj, idx) {
                    return (String(obj.Shop_id) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var commonaddressIdValue = '';
                if (parseVariable(commonaddressId)) {
                    commonaddressIdValue = commonaddressId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(commonaddressIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(commonaddressIdValue)) {
                        idNameObj = obj;
                    }
                    else if (commonaddressIdValue == undefined || commonaddressIdValue == null || commonaddressIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        userCommonAddressesList.push(idNameObj);
                });
            }
        }
    }
    return userCommonAddressesList;
}
function getCommonAddressesIdNameListByShopId(shopId, commonaddressId) {
    var userCommonAddressesIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Funeral Log--"
        };
        getAllCommonAddressesForCurrUser();
        if (parseVariable(userCommonAddresses, true)) {
            var datalist = userCommonAddresses;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userCommonAddresses, function (obj, idx) {
                    return (String(obj.Shop_id) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var commonaddressIdValue = '';
                if (parseVariable(commonaddressId)) {
                    commonaddressIdValue = commonaddressId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(commonaddressIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(commonaddressIdValue)) {
                        idNameObj = {
                            Id: obj.ID, Value: obj.NAME
                        };
                    }
                    else if (commonaddressIdValue == undefined || commonaddressIdValue == null || commonaddressIdValue === '') {
                        idNameObj = {
                            Id: obj.ID, Value: obj.NAME
                        };
                    }
                    if (idNameObj != undefined)
                        userCommonAddressesIdNameList.push(idNameObj);
                });
            }
            //if (userCommonAddressesIdNameList.length > 0) {
            //    userCommonAddressesIdNameList.insert(0, defaultObj);
            //}
        }
    }
    return userCommonAddressesIdNameList;
}
//User Drafts Related Methods
function getDraftsByShopId(shopId, draftId) {
    var userDraftsList = [];
    if (parseVariable(shopId)) {
        getAllDraftsForCurrUser();
        if (parseVariable(userDrafts, true)) {
            var datalist = userDrafts;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userDrafts, function (obj, idx) {
                    return (String(obj.shop) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var draftIdValue = '';
                if (parseVariable(draftId)) {
                    draftIdValue = draftId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(draftIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(draftIdValue)) {
                        idNameObj = obj;
                    }
                    else if (draftIdValue == undefined || draftIdValue == null || draftIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        userDraftsList.push(idNameObj);
                });
            }
        }
    }
    return userDraftsList;
}
function getDraftsForAllShopId(draftId) {
    var userDraftsList = [];
    if (parseVariable(shopId)) {
        getAllDraftsForCurrUser();
        if (parseVariable(userDrafts, true)) {
            var datalist = userDrafts;
            //if (String(shopId).indexOf(',') == -1) {
            //    datalist = $.grep(userDrafts, function (obj, idx) {
            //        return (String(obj.shop) == String(shopId));
            //    });
            //}
            if (datalist.length > 0) {
                var draftIdValue = '';
                if (parseVariable(draftId)) {
                    draftIdValue = draftId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(draftIdValue) && parseVariable(obj.ID) && String(obj.ID) == String(draftIdValue)) {
                        idNameObj = obj;
                    }
                    else if (draftIdValue == undefined || draftIdValue == null || draftIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        userDraftsList.push(idNameObj);
                });
            }
        }
    }
    return userDraftsList;
}
//User Drafts Items Related Methods
function getDraftItemsByDraftId(draftId) {
    var userDraftItemsList = [];
    if (parseVariable(draftId)) {
        getAllDraftsForCurrUser();
        if (parseVariable(userDraftItems, true)) {
            var datalist = userDraftItems;
            datalist = $.grep(userDraftItems, function (obj, idx) {
                return (String(obj.Draftid) == String(draftId));
            });
            userDraftItemsList = datalist;
        }
    }
    return userDraftItemsList;
}
//User Items Related Methods
function getItemsByShopId(shopId, itemId, itemcode, itemdesc) {
    var userItemsList = [];
    if (parseVariable(shopId)) {
        getAllItemsForCurrUser();
        if (parseVariable(userItems, true)) {
            var datalist = userItems;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userItems, function (obj, idx) {
                    return (String(obj.shop_id) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var itemIdValue = '';
                var itemcodeValue = '';
                var itemdescValue = '';
                if (parseVariable(itemId)) {
                    itemIdValue = itemId;
                }
                if (parseVariable(itemcode)) {
                    itemcodeValue = itemcode;
                }
                if (parseVariable(itemdesc)) {
                    itemdescValue = itemdesc;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(itemIdValue) && parseVariable(obj.ITEM_ID) && String(obj.ITEM_ID) == String(itemIdValue) && String(obj.ITEM_CODE) == String(itemcodeValue) && String(obj.ITEM_DESC) == String(itemdescValue)) {
                        idNameObj = obj;
                    }
                    else if (itemIdValue == undefined || itemIdValue == null || itemIdValue === '') {
                        idNameObj = obj;
                    }
                    if (idNameObj != undefined)
                        userItemsList.push(idNameObj);
                });
            }
        }
    }
    return userItemsList;
}
function getItemsIdNameListByShopId(shopId, itemId) {
    var userItemsIdNameList = [];
    if (parseVariable(shopId)) {
        var defaultObj = {
            Id: "--select--", Value: "--Select Item--"
        };
        getAllItemsForCurrUser();
        if (parseVariable(userItems, true)) {
            var datalist = userItems;
            if (String(shopId).indexOf(',') == -1) {
                datalist = $.grep(userItems, function (obj, idx) {
                    return (String(obj.shop_id) == String(shopId));
                });
            }
            if (datalist.length > 0) {
                var itemIdValue = '';
                if (parseVariable(itemId)) {
                    itemIdValue = itemId;
                }
                datalist.forEach(function (obj, idx) {
                    var idNameObj = undefined;
                    if (parseVariable(itemIdValue) && parseVariable(obj.ITEM_ID) && String(obj.ITEM_ID) == String(itemIdValue)) {
                        idNameObj = {
                            Id: obj.ITEM_ID, Value: obj.ITEM_CODE
                        };
                    }
                    else if (itemIdValue == undefined || itemIdValue == null || itemIdValue === '') {
                        idNameObj = {
                            Id: obj.ITEM_ID, Value: obj.ITEM_CODE
                        };
                    }
                    if (idNameObj != undefined)
                        userItemsIdNameList.push(idNameObj);
                });
            }
            if (userItemsIdNameList.length > 0) {
                userItemsIdNameList.insert(0, defaultObj);
            }
        }
    }
    return userItemsIdNameList;
}
//select shop default wire msg Related Methods
function getShopDefaultWireMsgShopId(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllDefaultWireMsgForCurrUser();
        if (parseVariable(userDefaultMsg, true)) {
            var selectedDefaultMsg = $.grep(userDefaultMsg, function (obj, idx) {
                return (String(obj.Shop_ID) == String(shopId));
            });
        }
    }
    return selectedDefaultMsg;
}
// select shop milebased details 
function getShopMilebaseddeliveryfees(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getMileBasedDeliveryFeeForCurrUser();
        if (parseVariable(milebaseddelivery, true)) {
            var selectedmilebaseddelivery = $.grep(milebaseddelivery, function (obj, idx) {
                return (String(obj.SHOPID) == String(shopId));
            });
        }
    }
    return selectedmilebaseddelivery;
}
function getShopZonebaseddeliveryfees(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getZoneBasedDeliveryFeeForCurrUser();
        if (parseVariable(zonebaseddelivery, true)) {
            var selectedzonebaseddelivery = $.grep(zonebaseddelivery, function (obj, idx) {
                return (String(obj.SHOP_CODE) == String(shopId));
            });
        }
    }
    return selectedzonebaseddelivery;
}
function getShopDefaultbaseddeliveryfee(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getDefaultDeliveryFeeForCurrUser();
        if (parseVariable(defaultbaseddeliveryfee, true)) {
            var selecteddefaultbaseddeliveryfee = $.grep(defaultbaseddeliveryfee, function (obj, idx) {
                return (String(obj.Store_id) == String(shopId));
            });
        }
    }
    return selecteddefaultbaseddeliveryfee;
}
function getShopholydaydelfee(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getHolydayDeliveryFeeForCurrUser();
        if (parseVariable(holydaydelfee, true)) {
            var selecteholydaydelfee = $.grep(holydaydelfee, function (obj, idx) {
                return (String(obj.SHOP_ID) == String(shopId));
            });
        }
    }
    return selecteholydaydelfee;
}
function getShopzipcodedelfee(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getZipcodeDeliveryFeeForCurrUser();
        if (parseVariable(zipcodedelfee, true)) {
            var selectezipcodedelfee = $.grep(zipcodedelfee, function (obj, idx) {
                return (String(obj.Store_id) == String(shopId));
            });
        }
    }
    return selectezipcodedelfee;
}
function getShopcitydelfee(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getCityDeliveryFeeForCurrUser();
        if (parseVariable(citydelfee, true)) {
            var selectecitydelfee = $.grep(citydelfee, function (obj, idx) {
                return (String(obj.Store_id) == String(shopId));
            });
        }
    }
    return selectecitydelfee;
}
function getShoprelaydelfee(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getAllRelayFeeForCurrUser();
        if (parseVariable(relaydelfee, true)) {
            var selecterelaydelfee = $.grep(relaydelfee, function (obj, idx) {
                return (String(obj.Store_id) == String(shopId));
            });
        }
    }
    return selecterelaydelfee;
}
//getZipcodeDeliveryFeeForCurrUser
//zipcodedelfee
//select shop CreditDebitReason Related Methods
function getShopCreditDebitReason(shopId) {
    if (parseVariable(shopId) && String(shopId).indexOf(',') == -1) {
        getCreditDebitReasonForCurrUser();
        if (parseVariable(creditDebit, true)) {
            var selectedcreditDebit = $.grep(creditDebit, function (obj, idx) {
                return (String(obj.ShopID) == String(shopId));
            });
        }
    }
    return selectedcreditDebit;
}

function getCanadaTaxList(state) {

    if (parseVariable(state) && String(state).indexOf(',') == -1) {
        getAllCanadaTaxList();
        if (parseVariable(canadaTaxList, true)) {

            var selectedCanadaTaxList = $.grep(canadaTaxList, function (obj, idx) {
                return (String(obj.State).toLowerCase() == String(state).toLowerCase() || String(obj.State_Abbrev).toLowerCase() == String(state).toLowerCase());
            });

        }
    }
    return selectedCanadaTaxList;
}
//TimeZoneList


//getCanadaTaxList

//getAllCanadaTaxList

//General Methods
function parseVariable(variable, isArray) {
    var result = false;
    if (typeof variable == "string") {
        result = (variable != undefined && variable != null && variable != '');
    }
    else if (typeof variable == "boolean" || typeof variable == "number") {
        result = (variable != undefined && variable != null);
    }
    else if (typeof variable === "object") {
        if (isArray) {
            //result = (variable != undefined && variable != null && variable.length > 0);
            result = (variable != undefined && variable != null);
        }
        else { result = (variable != undefined && variable != null); }
    }
    else if (typeof variable === "undefined") {
        result = false;
    }
    return result;
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
function redirectToLogin() {
    //window.location.href = getRootUrl() + "Default.aspx";
    window.location.href = getRootUrl() + "Account/Login";
}
function trimVariableValue(value) {
    var result = value;
    if (typeof variable == "string" && (value != undefined && value != null && value != '')) {
        result = value.trim();
    }
    return result;
}
function verifyAddress(country, city, state, zipcode, add1, add2) {
    var addressVerified = false;
    if (parseVariable(add1)) {
        addressVerified = verifyAddressFromGoogle(trimVariableValue(country), trimVariableValue(city), trimVariableValue(state), trimVariableValue(zipcode), trimVariableValue(add1));
    }
    if (addressVerified == false && parseVariable(add2)) {
        addressVerified = verifyAddressFromGoogle(trimVariableValue(country), trimVariableValue(city), trimVariableValue(state), trimVariableValue(zipcode), trimVariableValue(add2));
    }
    if (addressVerified == false) {
        addressVerified = verifyAddressFromGoogle(trimVariableValue(country), trimVariableValue(city), trimVariableValue(state), trimVariableValue(zipcode), trimVariableValue(add1) + ' ' + trimVariableValue(add2));
    }
    if (addressVerified) {
        return "Address Verified By Google";
        //  showSuccessToastr("Address Verified By Google", "", 5000);
    }
    else {
        return "Address Not Found By Google";
        //  showErrorToastr("Address Not Found By Google", "", 5000);
    }
}

//function verifyAddressNew(country, city, state, zipcode, add1, add2) {

//    return verifyAddressFromGoogle(trimVariableValue(country), trimVariableValue(city), trimVariableValue(state), trimVariableValue(zipcode), trimVariableValue(add1) + ' ' + trimVariableValue(add2));

//}


//function verifyAddressFromGoogle(country, city, state, zipcode, add) {
//    var verified = false;
//    var requestUrl = encodeURI(bingUrl + country.replace(/[^a-zA-Z0-9_]+/gi, ' ') + '/' + state.replace(/[^a-zA-Z0-9_]+/gi, ' ').trim() + '/' + zipcode.trim() + '/' + city.replace(/[^a-zA-Z0-9_]+/gi, ' ').trim() + '/' + add.replace(/[^a-zA-Z0-9_]+/gi, ' ').trim() + '?o=xml&key=' + bingKey);
//    $.ajax({
//        url: requestUrl,
//        method: "GET",
//        data: {},
//        async: false,
//        success: function (response) {
//            //DecreaseAjaxCount();
//            //if (response != undefined && response != null) {
//            //    currUserId = response;
//            //    if (currUserId == undefined || currUserId == null || String(currUserId) == '') {
//            //        redirectToLogin();
//            //    }
//            //    else {
//            //        localStorage.currUserId = currUserId;
//            //    }
//            //}
//            verified = true;
//        },
//        error: function (errorObj) {
//            //DecreaseAjaxCount();
//            //redirect to common error page
//            console.log(errorObj);
//            verified = false;
//        }
//    })
//    return verified;
//}
function verifyAddressFromGoogle(country, city, state, zipcode, add) {
    var verified = false;
    //  var requestUrl = getRootUrl() + "Common/verifyAddressFromGoogle";
    var requestUrl = getRootUrl() + "Common/verifyAddressFromGoogleNew";
    $.ajax({
        url: requestUrl,
        method: "GET",
        data: { country: country, city: city, state: state, zipcode: zipcode, add: add },
        async: false,
        success: function (response) {
            if (response != undefined && response != null) {
                verified = response;
            }
        },
        error: function (errorObj) {
            //DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
            verified = false;
        }
    })
    return verified;
}

function verifyAddressFromGoogleMew(country, city, state, zipcode, add1, add2) {
    var verified = false;
    var add = add1;
    if (add2 != '') {
        add += ' ' + add2
    }
    //  var requestUrl = getRootUrl() + "Common/verifyAddressFromGoogle";
    var requestUrl = getRootUrl() + "Common/verifyAddressFromGoogleNew";
    $.ajax({
        url: requestUrl,
        method: "GET",
        data: { country: country, city: city, state: state, zipcode: zipcode, add: add },
        async: false,
        success: function (response) {
            if (response != undefined && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error:")) {
                    verified = false;
                }
                else {
                    verified = response;
                }
            }
        },
        error: function (errorObj) {
            //DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
            verified = false;
        }
    })
    return verified;
}

function setAllObjects(allNeededData) {
    loggedInUserData = allNeededData.loggedInUserData;
    setObjectInLocal("loggedInUserData", allNeededData.loggedInUserData);
    userShopEmployeesList = allNeededData.employeeData;
    setObjectInLocal("userShopEmployeesList", allNeededData.employeeData);
    userShopDefaults = allNeededData.shopDefaults;
    setObjectInLocal("userShopDefaults", allNeededData.shopDefaults);
    userDriverList = allNeededData.drivers;
    setObjectInLocal("userDriverList", allNeededData.drivers);
    userCashRegistryList = allNeededData.cashRegistry;
    setObjectInLocal("userCashRegistryList", allNeededData.cashRegistry);
    allPaymentModes = allNeededData.paymentModes;
    setObjectInLocal("allPaymentModes", allNeededData.paymentModes);
    userPaymentModes = allNeededData.shopPaymentModes;
    setObjectInLocal("userPaymentModes", allNeededData.shopPaymentModes);
    allRecurringFrequencies = allNeededData.recurringFrequencies;
    setObjectInLocal("allRecurringFrequencies", allNeededData.recurringFrequencies);
    userShortCodes = allNeededData.shortCodes;
    setObjectInLocal("userShortCodes", allNeededData.shortCodes);
    userSourceCodes = allNeededData.sourceCodes;
    setObjectInLocal("userSourceCodes", allNeededData.sourceCodes);
    userTaxTypes = allNeededData.taxTypes;
    setObjectInLocal("userTaxTypes", allNeededData.taxTypes);
    allWireInTypes = allNeededData.wireInTypes;
    setObjectInLocal("allWireInTypes", allNeededData.wireInTypes);
    allWireOutTypes = allNeededData.wireOutTypes;
    setObjectInLocal("allWireOutTypes", allNeededData.wireOutTypes);
    userRequiredFields = allNeededData.shopRequiredFields;
    setObjectInLocal("userRequiredFields", allNeededData.shopRequiredFields);
    userZones = allNeededData.zones;
    setObjectInLocal("userZones", allNeededData.zones);
    allOccasions = allNeededData.occasions;
    setObjectInLocal("allOccasions", allNeededData.occasions);
    userOccasionQuotesList = allNeededData.occasionQuotes;
    setObjectInLocal("userOccasionQuotesList", allNeededData.occasionQuotes);
    userRequiredFields = allNeededData.employeeData;
    setObjectInLocal("userRequiredFields", allNeededData.employeeData);
    userFuneralLogs = allNeededData.funeralLogs;
    setObjectInLocal("userFuneralLogs", allNeededData.funeralLogs);
    allLocations = allNeededData.locations;
    setObjectInLocal("allLocations", allNeededData.locations);
    allCountries = allNeededData.countries;
    setObjectInLocal("allCountries", allNeededData.countries);
    userCommonAddresses = allNeededData.commonAddresses;
    setObjectInLocal("userCommonAddresses", allNeededData.commonAddresses);
    if (allNeededData.drafts != undefined && allNeededData.drafts != null) {
        userDrafts = allNeededData.drafts.drafts;
        setObjectInLocal("userDrafts", allNeededData.drafts.drafts);
        userDraftItems = allNeededData.drafts.draftItems;
        setObjectInLocal("userDraftItems", allNeededData.drafts.draftItems);
    }
    userItems = allNeededData.items;
    setObjectInLocal("userItems", allNeededData.items);
    userDefaultMsg = allNeededData.wirMsgs;
    setObjectInLocal("userDefaultMsg", allNeededData.wirMsgs);
    creditDebit = allNeededData.creditDebit;
    setObjectInLocal("creditDebit", allNeededData.creditDebit);
    milebaseddelivery = allNeededData.milebaseddelivery;
    setObjectInLocal("milebaseddelivery", allNeededData.milebaseddelivery);
    zonebaseddelivery = allNeededData.zonebaseddelivery;
    setObjectInLocal("zonebaseddelivery", allNeededData.zonebaseddelivery);
    defaultbaseddeliveryfee = allNeededData.defaultbaseddeliveryfee;
    setObjectInLocal("defaultbaseddeliveryfee", allNeededData.defaultbaseddeliveryfee);
    holydaydelfee = allNeededData.holydaydelfee;
    setObjectInLocal("holydaydelfee", allNeededData.holydaydelfee);
    zipcodedelfee = allNeededData.zipcodedelfee;
    setObjectInLocal("zipcodedelfee", allNeededData.zipcodedelfee);
    citydelfee = allNeededData.citydelfee;
    setObjectInLocal("citydelfee", allNeededData.citydelfee);
    relaydelfee = allNeededData.relaydelfee;
    setObjectInLocal("relaydelfee", allNeededData.relaydelfee);
    transferShopList = allNeededData.transferShopList;
    setObjectInLocal("transferShopList", allNeededData.transferShopList);

    canadaTaxList = allNeededData.canadaTaxList;
    setObjectInLocal("canadaTaxList", allNeededData.canadaTaxList);


    // holydaydelfee
}
function setObjectInLocal(key, obj) {
    //if (obj != undefined && obj != null && obj.length > 0) {
    if (obj != undefined && obj != null) {
        localStorage.setItem(key, JSON.stringify(obj));
    }
}
function getObjectFromLocal(key) {
    var obj = undefined;
    var retrievedObject = localStorage.getItem(key);
    if (retrievedObject != undefined && redirectToLogin != null) {
        obj = JSON.parse(retrievedObject);
    }
    return obj;
}
//Ajax Methods
function getCurrUser(refreshData) {
    //loadCurrUserIdFromLS();
    var neededCompleteRefresh = refreshData;
    if (refreshData == true || !parseVariable(currUserId)) {
        var urlLink = getRootUrl() + "Common/getCurrUser";
        IncreaseAjaxCount();
        $.ajax({
            url: urlLink,
            method: "GET",
            data: {
            },
            async: false,
            success: function (response) {
                DecreaseAjaxCount();
                if (response != undefined && response != null) {
                    currUserId = response;
                    if (currUserId == undefined || currUserId == null || String(currUserId) == '') {
                        redirectToLogin();
                    }
                    else if (localStorage.currUserId == currUserId) {
                        localStorage.currUserId = currUserId;
                    }
                    else {
                        localStorage.currUserId = currUserId;
                        neededCompleteRefresh = true;
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
    return neededCompleteRefresh;
}
function getShopDetailsForCurrUser(refreshData) {
    userShopList = getObjectFromLocal('userShopList');
    if (refreshData == true || !(parseVariable(userShopList, true))) {
        var urlValue = getRootUrl() + 'Common/getAllShopDetails';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userShopList = response;
                        setObjectInLocal('userShopList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
//transferShopList
function getTransferShopDetailsForCurrUser(refreshData) {
    transferShopList = getObjectFromLocal('transferShopList');
    if (refreshData == true || !(parseVariable(transferShopList, true))) {
        var urlValue = getRootUrl() + 'Common/getAllTransferShopDetails';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        transferShopList = response;
                        setObjectInLocal('transferShopList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getShopEmployeesForCurrUser(refreshData) {
    userShopEmployeesList = getObjectFromLocal('userShopEmployeesList');
    if (refreshData == true || !(parseVariable(userShopEmployeesList, true))) {
        var urlValue = getRootUrl() + 'Common/getAllShopEmployees';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userShopEmployeesList = response;
                        setObjectInLocal('userShopEmployeesList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getShopDefaultForCurrUser(refreshData) {
    userShopDefaults = getObjectFromLocal('userShopDefaults');
    if (refreshData == true || !(parseVariable(userShopDefaults, true))) {
        var urlValue = getRootUrl() + 'Common/getAllShopDefaults';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userShopDefaults = response;
                        setObjectInLocal('userShopDefaults', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getDriversForCurrUser(refreshData) {
    userDriverList = getObjectFromLocal('userDriverList');
    if (refreshData == true || !(parseVariable(userDriverList, true))) {
        var urlValue = getRootUrl() + 'Common/getAllDrivers';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userDriverList = response;
                        setObjectInLocal('userDriverList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getCashRegistryForCurrUser(refreshData) {
    userCashRegistryList = getObjectFromLocal('userCashRegistryList')
    if (refreshData == true || !(parseVariable(userCashRegistryList, true))) {
        var urlValue = getRootUrl() + 'Common/getAllCashRegistry';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userCashRegistryList = response;
                        setObjectInLocal('userCashRegistryList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllPaymentModes(refreshData) {
    allPaymentModes = getObjectFromLocal('allPaymentModes');
    if (refreshData == true || !(parseVariable(allPaymentModes, true))) {
        var urlValue = getRootUrl() + 'Common/getAllPaymentModes';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allPaymentModes = response;
                        setObjectInLocal('allPaymentModes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getShopPaymentModesForCurrUser(refreshData) {
    userPaymentModes = getObjectFromLocal('userPaymentModes');
    if (refreshData == true || !(parseVariable(userPaymentModes, true))) {
        var urlValue = getRootUrl() + 'Common/getAllShopPaymentModes';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userPaymentModes = response;
                        setObjectInLocal('userPaymentModes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllRecurringFrequencies(refreshData) {
    allRecurringFrequencies = getObjectFromLocal('allRecurringFrequencies');
    if (refreshData == true || !(parseVariable(allRecurringFrequencies, true))) {
        var urlValue = getRootUrl() + 'Common/getAllRecurringFrequencies';
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allRecurringFrequencies = response;
                        setObjectInLocal('allRecurringFrequencies', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllShortCodesForCurrUser(refreshData) {
    userShortCodes = getObjectFromLocal('userShortCodes');
    if (refreshData == true || !(parseVariable(userShortCodes, true))) {
        var urlValue = getRootUrl() + "Common/getAllShortCodes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userShortCodes = response;
                        setObjectInLocal('userShortCodes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllSourceCodesForCurrUser(refreshData) {
    userSourceCodes = getObjectFromLocal('userSourceCodes');
    if (refreshData == true || !(parseVariable(userSourceCodes, true))) {
        var urlValue = getRootUrl() + "Common/getAllSourceCodes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userSourceCodes = response;
                        setObjectInLocal('userSourceCodes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllTaxTypesForCurrUser(refreshData) {
    userTaxTypes = getObjectFromLocal('userTaxTypes');
    if (refreshData == true || !(parseVariable(userTaxTypes, true))) {
        var urlValue = getRootUrl() + "Common/getAllTaxTypes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userTaxTypes = response;
                        setObjectInLocal('userTaxTypes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllWireInTypes(refreshData) {
    allWireInTypes = getObjectFromLocal('allWireInTypes');
    if (refreshData == true || !(parseVariable(allWireInTypes, true))) {
        var urlValue = getRootUrl() + "Common/getAllWireInTypes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allWireInTypes = response;
                        setObjectInLocal('allWireInTypes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function geAllWireOutTypes(refreshData) {
    allWireOutTypes = getObjectFromLocal('allWireOutTypes');
    if (refreshData == true || !(parseVariable(allWireOutTypes, true))) {
        var urlValue = getRootUrl() + "Common/getAllWireOutTypes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allWireOutTypes = response;
                        setObjectInLocal('allWireOutTypes', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllShopRequiredFieldsForCurrUser(refreshData) {
    userRequiredFields = getObjectFromLocal('userRequiredFields');
    if (refreshData == true || !(parseVariable(userRequiredFields, true))) {
        var urlValue = getRootUrl() + "Common/getAllShopRequiredFields";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userRequiredFields = response;
                        setObjectInLocal('userRequiredFields', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllZonesForCurrUser(refreshData) {
    userZones = getObjectFromLocal('userZones');
    if (refreshData == true || !(parseVariable(userZones, true))) {
        var urlValue = getRootUrl() + "Common/getAllZones";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userZones = response;
                        setObjectInLocal('userZones', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllOccasions(refreshData) {
    allOccasions = getObjectFromLocal('allOccasions');
    if (refreshData == true || !(parseVariable(allOccasions, true))) {
        var urlValue = getRootUrl() + "Common/getAllOccasions";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allOccasions = response;
                        setObjectInLocal('allOccasions', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getOccasionsQuotesForCurrUser(refreshData) {
    userOccasionQuotesList = getObjectFromLocal('userOccasionQuotesList');
    if (refreshData == true || !(parseVariable(userOccasionQuotesList, true))) {
        var urlValue = getRootUrl() + "Common/getAllOccasionQuotes";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userOccasionQuotesList = response;
                        setObjectInLocal('userOccasionQuotesList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllFuneralLogsForCurrUser(refreshData) {
    userFuneralLogs = getObjectFromLocal('userFuneralLogs');
    if (refreshData == true || !(parseVariable(userFuneralLogs, true))) {
        var urlValue = getRootUrl() + "Common/getAllFunneralLogs";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            async: false,
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userFuneralLogs = response;
                        setObjectInLocal('userFuneralLogs', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllLocations(refreshData) {
    allLocations = getObjectFromLocal('allLocations');
    if (refreshData == true || !(parseVariable(allLocations, true))) {
        var urlValue = getRootUrl() + "Common/getAllLocations";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allLocations = response;
                        setObjectInLocal('allLocations', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllCountries(refreshData) {
    allCountries = getObjectFromLocal('allCountries');
    if (refreshData == true || !(parseVariable(allCountries, true))) {
        var urlValue = getRootUrl() + "Common/getAllCountries";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        allCountries = response;
                        setObjectInLocal('allCountries', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllCommonAddressesForCurrUser(refreshData) {
    userCommonAddresses = getObjectFromLocal('userCommonAddresses');
    if (refreshData == true || !(parseVariable(userCommonAddresses, true))) {
        var urlValue = getRootUrl() + "Common/getAllCommonAddresses";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            async: false,
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userCommonAddresses = response;
                        setObjectInLocal('userCommonAddresses', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllDraftsForCurrUser(refreshData) {
    userDrafts = getObjectFromLocal('userDrafts');
    userDraftItems = getObjectFromLocal('userDraftItems');
    if (refreshData == true || !(parseVariable(userDrafts, true))) {
        var urlValue = getRootUrl() + "Common/getAllDrafts";
        //  IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                //   DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        var draftDetails = response;
                        userDrafts = draftDetails.drafts;
                        userDraftItems = draftDetails.draftItems;
                        setObjectInLocal('userDrafts', userDrafts);
                        setObjectInLocal('userDraftItems', userDraftItems);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                //   DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllItemsForCurrUser(refreshData) {
    userItems = getObjectFromLocal('userItems');
    if (refreshData == true || !(parseVariable(userItems, true))) {
        var urlValue = getRootUrl() + "Common/getAllItems";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userItems = response;
                        setObjectInLocal('userItems', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllDefaultWireMsgForCurrUser(refreshData) {
    userDefaultMsg = getObjectFromLocal('userDefaultMsg');
    if (refreshData == true || !(parseVariable(userDefaultMsg, true))) {
        var urlValue = getRootUrl() + "Common/getAllWireServiceDefaultMsg";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            // async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        userDefaultMsg = response;
                        setObjectInLocal('userDefaultMsg', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getMileBasedDeliveryFeeForCurrUser(refreshData) {
    milebaseddelivery = getObjectFromLocal('milebaseddelivery');
    if (refreshData == true || !(parseVariable(milebaseddelivery, true))) {
        var urlValue = getRootUrl() + "Common/getAllMileBasedDeliveryFee";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //   async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        milebaseddelivery = response;
                        setObjectInLocal('milebaseddelivery', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getZoneBasedDeliveryFeeForCurrUser(refreshData) {
    zonebaseddelivery = getObjectFromLocal('zonebaseddelivery');
    if (refreshData == true || !(parseVariable(zonebaseddelivery, true))) {
        var urlValue = getRootUrl() + "Common/getAllZoneBasedDeliveryFee";
        IncreaseAjaxCount();
        var zoneBasedDeliveryFee = [];
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //    async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        zonebaseddelivery = response;
                        setObjectInLocal('zonebaseddelivery', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getDefaultDeliveryFeeForCurrUser(refreshData) {
    defaultbaseddeliveryfee = getObjectFromLocal('defaultbaseddeliveryfee');
    if (refreshData == true || !(parseVariable(defaultbaseddeliveryfee, true))) {
        var urlValue = getRootUrl() + "Common/getAllDefaultDeliveryFee";
        var defaultDeliveryFee = [];
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //  async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        defaultbaseddeliveryfee = response;
                        setObjectInLocal('defaultbaseddeliveryfee', response);
                        // defaultDeliveryFee = response;
                        // defaultbaseddeliveryfee
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getHolydayDeliveryFeeForCurrUser(refreshData) {
    holydaydelfee = getObjectFromLocal('holydaydelfee');
    if (refreshData == true || !(parseVariable(holydaydelfee, true))) {
        var urlValue = getRootUrl() + "Common/getAllHolydayDeliveryFee";
        var holydayDeliveryFee = [];
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //   async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        holydaydelfee = response;
                        setObjectInLocal('holydaydelfee', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getZipcodeDeliveryFeeForCurrUser(refreshData) {
    zipcodedelfee = getObjectFromLocal('zipcodedelfee');
    if (refreshData == true || !(parseVariable(zipcodedelfee, true))) {
        var urlValue = getRootUrl() + "Common/getAllZipDeliveryFee";
        var zipcodeDeliveryFee = [];
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //  async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        zipcodedelfee = response;
                        setObjectInLocal('zipcodedelfee', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getCityDeliveryFeeForCurrUser(refreshData) {
    citydelfee = getObjectFromLocal('citydelfee');
    if (refreshData == true || !(parseVariable(citydelfee, true))) {
        var urlValue = getRootUrl() + "Common/getAllCityDeliveryFee";
        var cityDeliveryFee = [];
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //    async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        //   cityDeliveryFee = response;
                        citydelfee = response;
                        setObjectInLocal('citydelfee', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllRelayFeeForCurrUser(refreshData) {
    relaydelfee = getObjectFromLocal('relaydelfee');
    if (refreshData == true || !(parseVariable(relaydelfee, true))) {
        var urlValue = getRootUrl() + "Common/getAllRelayFee";
        var relayFee = [];
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //  async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        // 
                        relaydelfee = response;
                        setObjectInLocal('relaydelfee', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getHolidaylistForCurrUser(refreshData) {
    holidayslist = getObjectFromLocal('holidayslist');
    if (refreshData == true || !(parseVariable(holidayslist, true))) {
        var urlValue = getRootUrl() + "Common/getHolidaylist";
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //   async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        holidayslist = response;
                        setObjectInLocal('holidayslist', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}

function getAllCanadaTaxList(refreshData) {

    canadaTaxList = getObjectFromLocal('canadaTaxList');
    if (refreshData == true || !(parseVariable(holidayslist, true))) {
        var urlValue = getRootUrl() + "Common/getCanadaTaxList";
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            //   async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        holidayslist = response;
                        setObjectInLocal('canadaTaxList', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }

}

function gethinturlList(refreshData) {
    hinturlList = getObjectFromLocal('hinturlList');
    if (refreshData == true || !(parseVariable(hinturlList, true))) {
        var urlValue = getRootUrl() + "Common/GetHintsByPageUrl";
        $.ajax({
            url: urlValue,
            data: {
                PageName: ''
            },
            type: 'POST',
            success: function (result) {
                if (result.IsSuccess) {
                    if (result.HintUrl != "" && result.HintUrl != "") {
                        var hinturl = JSON.parse(result.HintUrl);
                        hinturlList = hinturl;
                        setObjectInLocal('hinturlList', hinturl);
                    }
                }
            },
            error: function (jqXHR, status, err) {
                toastr.error("Something went wrong");
            }
        });
    }
}
function GetMVCMenuList(refreshData) {
    MVCMenuList = getObjectFromLocal('MVCMenuList');
    if (refreshData == true || !(parseVariable(MVCMenuList, true))) {
        $.ajax({
            url: getRootUrl() + "Common/GetMVCMenusByPageUrl",
            data: {
                PageName: ''
            },
            type: 'POST',
            success: function (result) {
                if (result.IsSuccess) {
                    if (result.MenuListResult != "" && result.MenuListResult != "") {
                        var MenuList = JSON.parse(result.MenuListResult);
                        MVCMenuList = MenuList;
                        setObjectInLocal('MVCMenuList', MenuList);
                    }
                }
            },
            error: function (jqXHR, status, err) {
                toastr.error("Something went wrong");
            }
        });
    }
}
function GetMenuList(refreshData) {
    MenuList = getObjectFromLocal('MenuList');
    if (refreshData == true || !(parseVariable(MenuList, true))) {
        $.ajax({
            url: getRootUrl() + "Common/GetMenuListByRoleId",
            dataType: 'json',
            async: false,
            data: {},
            success: function (data) {
                if (data.IsSuccess) {
                    if (data.MenuList != undefined && data.MenuList != null && data.MenuList.length > 0) {
                        MenuList = JSON.parse(data.MenuList);
                        setObjectInLocal('MenuList', MenuList);
                    }
                }
            }
        });
    }
}
function GetNewsslider() {
    var urlValue = getRootUrl() + 'Common/getNewsslider';
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'POST',
        data: {},
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            DecreaseAjaxCount();
            if (response != null && response != '') {
                if (typeof response == "string" && response.length > 0 && response.startsWith("Error") == true) {
                }
                else {
                    var newslist = response;
                    //side-menu
                    var out = [];
                    out.News = newslist;
                    var source = $("#Newsslider").html();
                    var compiledTemplate = Handlebars.compile(source);
                    var compiledHtml = compiledTemplate(out);
                    $("#newsdiv").html(compiledHtml);
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //  DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
}

//Time Zone Function

function GetTimeZoneBaseOnShopId(selectedShopId) {
    debugger
    var TimeZoneDetail = [];
    var data = {};
    var ZONEHOUR = '0';
    var TIMEZONE_DESC = '';
    debugger;
    var urlLink = getRootUrl() + "Common/GetTimeZoneBaseOnShopId";
    $.ajax({
        url: urlLink,
        method: "POST",
        data: { shopId: selectedShopId },
        async: false,
        success: function (response, status, jqXHR) {
            if (response != null && response != null && response.length > 0) {
                if (response.startsWith("Error") == true) {
                    //redirect to common error page
                    var errorMsg = response.replace("Error:", "");
                    ZONEHOUR = '0';
                    TIMEZONE_DESC = '';

                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    var TimeZone = JSON.parse(response);
                    if (TimeZone != undefined && TimeZone != null && TimeZone.length > 0) {

                        ZONEHOUR = TimeZone[0].ZONEHOUR;
                        TIMEZONE_DESC = TimeZone[0].TIMEZONE_DESC;

                    }
                }

            }
        },
        error: function (errorObj) {
            //redirect to common error page
            console.log(errorObj);
        }
    });

    data.ZoneHoue = ZONEHOUR;
    data.TimeZoneDesc = TIMEZONE_DESC;

    TimeZoneDetail.push(data);
    return TimeZoneDetail;
}

function updatefreashdesk(ID, TicketLink) {
    var urlValue = getRootUrl() + 'Common/UpdateFreshDesk';
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'POST',
        data: JSON.stringify({ ID: ID }),
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (response) {
            DecreaseAjaxCount();
            if (response != null && response != '') {
                if (typeof response == "string" && response.length > 0 && response.startsWith("Error") == true) {
                }
                else {
                    GetNewsslider();
                    if (TicketLink != '' && TicketLink != undefined && TicketLink != null) {
                        window.open(TicketLink);
                        //  var newWin = window.open();
                        //  newWin.location = href;
                        //$.ajax({
                        //    url: TicketLink,
                        //    dataType: 'json',
                        //    async: false,
                        //    success: function(r) {
                        //        window.open(response['url']);
                        //    }
                        // window.open(TicketLink, '_blank');
                    }
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            console.log(errorObj);
        }
    });
}
function getCreditDebitReasonForCurrUser(refreshData) {
    creditDebit = getObjectFromLocal('creditDebit');
    if (refreshData == true || !(parseVariable(creditDebit, true))) {
        var urlValue = getRootUrl() + "Common/getCreditDebitReason";
        IncreaseAjaxCount();
        $.ajax({
            url: urlValue,
            method: 'GET',
            data: {
            },
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response, status, jqXHR) {
                DecreaseAjaxCount();
                if (response != null && response != null) {
                    if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                        //redirect to common error page
                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        creditDebit = response;
                        setObjectInLocal('creditDebit', response);
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                DecreaseAjaxCount();
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
}
function getAllNeededDataInSingleAjax(refreshData) {
    //if (refreshData == true || !(parseVariable(userDrafts, true))) {
    var urlValue = getRootUrl() + "Common/getAllNeededDataForCurrUser";
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {},
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    var allNeededData = response;
                    setAllObjects(allNeededData);
                    //setupAppCues();
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    //}
}
/** @description It checks wether given input is empty,null or number or not  
 * @param {string} Input string 
 * @param {bool} NumberFlag - Set true if you want to check given input is number or not also
 * @return {bool}  It returns true if given string is empty or null or not a number
 */
function IsNullOrEmptyOrNumber(value, isValidateNumber) {
    var status = false;//If means given data is empty or null or not a number
    if (value == "" || value == null) {
        status = true;
    }
    if (isValidateNumber) {
        if (isNaN(value)) {
            status = true;
        }
    }
    return status;
}
//reloadUserSettings();
var IsLogin = localStorage.getItem("IsLogin"); if (IsLogin == 'Yes') { GetLocalData(false); }
function GetLocalData(refreshData) { if (allPaymentModes == undefined) { reloadOtherData(refreshData); } }
//function setupAppCues() {
//    // NOTE: These values should be specific to the current user.
//    Appcues.identify(currUserId, { // Unique identifier for current user
//        name: loggedInUserData.fullName, // Current user's name
//        email: loggedInUserData.userEmail, // Current user's email
//        created_at: loggedInUserData.userCreatedDateTime, // Unix timestamp of user signup date
//        // Additional user properties.
//        is_trial: loggedInUserData.isTrialAccount,
//        accountType: loggedInUserData.accountType,
//    });
//}
function getSalesRepListByShopId(shopId) {
    var salesRepList = [];
    $.each(userShopEmployeesList, function (index, obj) {
        if (obj.Shop_Id == shopId && obj.IsSalesRep == 'Yes') {
            salesRepList.push({ displayText: obj.EMPNAME, valueText: obj.EMPLOYEE_ID, IsEnabled: obj.FLAG });
        }
    });
    return salesRepList;
}
function roundNumber(num, scale) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale);
    } else {
        var arr = ("" + num).split("e");
        var sig = ""
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}
function capitalize(textboxid, str) {
    var i;
    var j;
    var a = str.split(" ");
    var strout = "";
    for (i = 0; i < a.length; i++) {
        if (strout.length > 0) {
            strout = strout + " " + a[i].toTitleCase();
        }
        else {
            strout = a[i].toTitleCase();
        }
    }
    var b = strout.split("\n");
    strout = "";
    for (j = 0; j < b.length; j++) {
        if (b[j] && b[j].length >= 1) {
            var firstChar = b[j].charAt(0);
            var remainingStr = b[j].slice(1);
            b[j] = firstChar.toUpperCase() + remainingStr;
        }
        if (strout.length > 0) {
            strout = strout + "\n" + b[j];
        }
        else {
            strout = b[j];
        }
    }
    document.getElementById(textboxid).value = strout;
}
String.prototype.toTitleCase = function () {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }
        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }
        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};
function getTaxableAmt(shopId, subTotal, discountAmt, deliveryFeeAmt, relayFeeAmt) {
    var totalAmt = subTotal;
    var shopInfo = getShopDetailsByShopId(shopId);
    if (shopInfo != undefined && shopInfo != null) {
        if (parseVariable(shopInfo.DeliveryTax) && $.trim(shopInfo.DeliveryTax).toLowerCase() == 'yes') {
            totalAmt += deliveryFeeAmt;
        }
        if (parseVariable(shopInfo.RelayTax) && $.trim(shopInfo.RelayTax).toLowerCase() == 'yes') {
            totalAmt += relayFeeAmt;
        }

        if (parseVariable(shopInfo.DiscountTax) && $.trim(shopInfo.DiscountTax).toLowerCase() != 'yes') {
            totalAmt -= discountAmt;
        }
    }
    return totalAmt;
}


//function GetTaxAmount(shopid, subtotal, discAmt, deliveryFee, relayFee, taxPer) {
//    var taxAmt = 0;
//    var taxableAmt = getTaxableAmt(shopId, subTotal, discAmt, deliveryFee, relayFee);
//    if (taxPer > 0) {
//        taxAmt = (taxableAmt * taxPer) / 100;
//    }
//    return taxAmt;
//}

function getMileBasedDeliveryFee() {
    var milesBasedDeliveryFee = [];
    var urlValue = getRootUrl() + "Common/getAllMileBasedDeliveryFee";
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    milesBasedDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return milesBasedDeliveryFee;
}
function getZoneBasedDeliveryFee() {
    var urlValue = getRootUrl() + "Common/getAllZoneBasedDeliveryFee";
    IncreaseAjaxCount();
    var zoneBasedDeliveryFee = [];
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    zoneBasedDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return zoneBasedDeliveryFee;
}
function getDefaultDeliveryFee() {
    var urlValue = getRootUrl() + "Common/getAllDefaultDeliveryFee";
    var defaultDeliveryFee = [];
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    defaultDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return defaultDeliveryFee;
}
function getHolydayDeliveryFee() {
    var urlValue = getRootUrl() + "Common/getAllHolydayDeliveryFee";
    var holydayDeliveryFee = [];
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    holydayDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return holydayDeliveryFee;
}
function getZipcodeDeliveryFee() {
    var urlValue = getRootUrl() + "Common/getAllZipDeliveryFee";
    var zipcodeDeliveryFee = [];
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    zipcodeDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return zipcodeDeliveryFee;
}
function getCityDeliveryFee() {
    var urlValue = getRootUrl() + "Common/getAllCityDeliveryFee";
    var cityDeliveryFee = [];
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    cityDeliveryFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return cityDeliveryFee;
}
function getAllRelayFee() {
    var urlValue = getRootUrl() + "Common/getAllRelayFee";
    var relayFee = [];
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                    //redirect to common error page
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    relayFee = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return relayFee;
}
function WebRequest1(reciAdd1, reciAdd2, reciCity, reciState, reciZipcode, fromAddress) {
    var miles = '';
    if (reciAdd1 == '' && reciAdd2 == '' && reciCity == '' && reciState == '' && reciZipcode == '') {
        return miles;
    }
    var urlLink = getRootUrl() + "Common/calculateMiles";
    $.ajax({
        url: urlLink,
        method: "GET",
        data: { reciAdd1: reciAdd1, reciAdd2: reciAdd2, reciCity: reciCity, reciState: reciState, reciZipcode: reciZipcode, fromAddress: fromAddress },
        async: false,
        success: function (response) {
            //
            if (response != undefined && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error:")) {
                    miles = "0";
                }
                else {
                    miles = response;
                }
            }
            else {
                miles = "0";
            }
        },
        error: function (errorObj) {
            //redirect to common error page
            console.log(errorObj);
            miles = "0";
        }
    });
    return miles;
}


//calculateMilesNew


// Added By Nanda to Calculate Miles/Distance between 2 locations with Google Maps API
//<script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
function GoogleDrivingDistance(reciAdd1, reciAdd2, reciCity, reciState, reciZipcode, fromAddress) {
    var miles = '';
    if (reciAdd1 == '' && reciAdd2 == '' && reciCity == '' && reciState == '' && reciZipcode == '') {
        return miles;
    }
    var urlLink = getRootUrl() + "Common/calculateMilesNew";
    $.ajax({
        url: urlLink,
        method: "GET",
        data: { reciAdd1: reciAdd1, reciAdd2: reciAdd2, reciCity: reciCity, reciState: reciState, reciZipcode: reciZipcode, fromAddress: fromAddress },
        async: false,
        success: function (response) {
            //
            if (response != undefined && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error:")) {
                    miles = "0";
                }
                else {
                    try {
                        if (JSON.parse(response).rows[0].elements[0].status == "OK") {
                            //  miles = JSON.parse(response).rows[0].elements[0].distance.text;
                            var METERS_TO_MILES = 0.000621371192;
                            miles = (Math.round(JSON.parse(response).rows[0].elements[0].distance.value * METERS_TO_MILES * 10) / 10);

                        }
                        else {
                            miles = "0";
                        }
                    }
                    catch (e) {
                        miles = "0";
                    }

                }
            }
            else {
                miles = "0";
            }
        },
        error: function (errorObj) {
            //redirect to common error page
            console.log(errorObj);
            miles = "0";
        }
    });
    return miles;
}

function CalculateDeliveryFee(shopId, zipCode, city, country, state, deliveryDate, zoneId, CurrentDeliveryFee, isDeliverychanged, defaultDeliveryFee, holydayDeliveryFee, milesBasedDeliveryFee, zoneBasedDeliveryFee, zipcodeDeliveryFee, cityDeliveryFee, reciAdd1, reciAdd2) {

    // Modifyed By Nanda to set the delivery fee to -100 on 061418
    // var deliveryFee = '0.00';
    var deliveryFee = -100;
    // var defaultDeliveryFee = '0.00';
    var fromAddress = '';
    if (shopId != undefined && shopId != '' && shopId != null && shopId != '--select--') {
        var shopInfo = getShopDetailsByShopId(shopId);
        var street = shopInfo.SHOP_ADDRESS1 + seperator + shopInfo.SHOP_ADDRESS2;
        if (street != undefined && street != null && street != '' && street.trim() != '') {
            fromAddress = shopInfo.SHOP_ADDRESS1 + seperator +
                            shopInfo.SHOP_ADDRESS2 + seperator +
                            shopInfo.SHOP_CITY + seperator +
                            shopInfo.SHOP_STATE + seperator +
                            shopInfo.SHOP_ZIP;
        }
        else {
            fromAddress = shopInfo.SHOP_CITY + ',' +
                            shopInfo.SHOP_STATE + seperator +
                            shopInfo.SHOP_ZIP;
        }
        // get all deliveryfees based shopid
        var deliveryFees = $.grep(defaultDeliveryFee, function (value, idx) {
            return value.Store_id == shopId;
        });
        //  if (isDeliverychanged==false || $("#paymentDelFeeTxt").val()=="0.00") {
        if (isDeliverychanged == false || CurrentDeliveryFee == "0.00") {
            //get home country value based selected shop id
            var homeCountry = $.grep(deliveryFees, function (value, idx) {
                return value.ParamName == 'Home Country';
            });
            if (country != undefined && country != '' && country != null && country != '--select--' && homeCountry != null && homeCountry != undefined && homeCountry.length > 0) {
                // check selected country not home country 
                if ($.trim(country).toLowerCase() != $.trim(homeCountry[0].ParamValue).toLowerCase()) {
                    var internationalfee = $.grep(deliveryFees, function (value, idx) {
                        return value.ParamName == 'International Fee';
                    });
                    if (internationalfee.length > 0)
                    { deliveryFee = internationalfee[0].ParamValue; }
                }
            }
            else {
                deliveryFee = -100;
            }
            if (deliveryFee == -100 || deliveryFee == undefined || String(deliveryFee) == '' || deliveryFee == null) {
                // check holyday override delivery fee  
                var holydayDelivery = $.grep(holydayDeliveryFee, function (value, idx) {
                    return value.SHOP_ID == shopId;
                });
                if (deliveryDate != undefined && deliveryDate != null && String(deliveryFee) != '') {

                    var deliveryholyday = $.grep(holydayDelivery, function (value, idx) {
                        return new Date(parseInt(value.HOLYDAY_DATE.substr(6))).toDateString() == new Date(deliveryDate).toDateString();
                    });
                    if (deliveryholyday.length > 0)
                    { deliveryFee = deliveryholyday[0].DELIVERY_FEE; }
                }
                else {
                    deliveryFee = -100;
                }
            }
            if (deliveryFee == -100 || deliveryFee == undefined || String(deliveryFee) == '' || deliveryFee == null) {
                var deliveryFeeType = shopInfo.DeliveryFeeType;
                if (deliveryFeeType != undefined && deliveryFeeType != '' && deliveryFeeType != null) {
                    if (deliveryFeeType == 'mile') {
                        deliveryFee = MileBasedDeliveryFeeCalculation(shopId, zipCode, city, state, milesBasedDeliveryFee, reciAdd1, reciAdd2, fromAddress);
                    }
                    else if (deliveryFeeType == 'zone') {

                        if (zoneId == "0" || zoneId == "--select--") // not able to get zone id then get delivery fee from Default
                        {
                            deliveryFee = ZipCodeOrCityDeliveryFeeCalculation(shopId, zipCode, city, zipcodeDeliveryFee, cityDeliveryFee, deliveryFees);
                        }
                        else // Get the zone Based Delivery Fee
                        {
                            deliveryFee = ZoneBasedDeliveryFeeCalculation(zoneId, zoneBasedDeliveryFee, shopId);
                        }


                    }
                    else {
                        deliveryFee = ZipCodeOrCityDeliveryFeeCalculation(shopId, zipCode, city, zipcodeDeliveryFee, cityDeliveryFee, deliveryFees);
                    }
                }
            }
            //var ExistDelfee

            // Added By Nanda check the delivery fee have initial value on 061518
            if (deliveryFee < 0) {
                deliveryFee = "0.00"
            }

            return parseFloat(deliveryFee).toFixed(2);

        }
    }
    // return deliveryFee;
}

function MileBasedDeliveryFeeCalculation(shopId, zipCode, city, state, milesBasedDeliveryFee, reciAdd1, reciAdd2, fromAddress) {
    var deliveryFee = -100;
    // Updated Mile calculation method by nanda on 05/06/2018
    //  var mile = WebRequest1(reciAdd1, reciAdd2, city, state, zipCode, fromAddress);
    var mile = GoogleDrivingDistance(reciAdd1, reciAdd2, city, state, zipCode, fromAddress);
    if (mile != undefined && mile != '' && mile != null && mile != 0) {
        var milesBasedDelivery = $.grep(milesBasedDeliveryFee, function (value, idx) {
            return value.SHOPID == shopId;
        });
        var deliveryFeemile = $.grep(milesBasedDelivery, function (value, idx) {
            return parseFloat(value.MFROM.replace(/,/g, '')) <= parseFloat(String(mile).replace(/,/g, '')) && parseFloat(value.MTO.replace(/,/g, '')) >= parseFloat(String(mile).replace(/,/g, ''));
        });
        if (deliveryFeemile.length > 0) {
            deliveryFee = deliveryFeemile[0].MPRICE;
            if (deliveryFeemile.length > 1) {
                //  
                // toastr.error('Attachment size limit exceed');
                localStorage.setItem("ExtraMileFee", "Yes");
            }
        }
    }
    else {
        deliveryFee = -100;
    }

    return deliveryFee;
}

function ZoneBasedDeliveryFeeCalculation(zoneId, zoneBasedDeliveryFee, shopId) {
    var deliveryFee = '0.00';
    if (zoneId != undefined && zoneId != '' && zoneId != null && zoneId != '--select--') {
        var deliveryFeezone = $.grep(zoneBasedDeliveryFee, function (value, idx) {
            return value.SHOP_CODE == shopId && value.Zone_Id == zoneId;
        });
        if (deliveryFeezone.length > 0) {
            deliveryFee = deliveryFeezone[0].ZoneFee;
        }
    }
    else {
        deliveryFee = '0.00';
    }
    return deliveryFee;
}

function ZipCodeOrCityDeliveryFeeCalculation(shopId, zipCode, city, zipcodeDeliveryFee, cityDeliveryFee, deliveryFees) {
    var deliveryFee = -100;
    // check zipcode deliveryfee
    // check city  based Delivery   
    // check  Home city
    // check Home city / OutGoing based Delivery 
    if (zipCode != undefined && zipCode != null && zipCode != '') {
        var zipcodefee = $.grep(zipcodeDeliveryFee, function (value, idx) {
            return value.Store_id == shopId && value.ZipCode == zipCode;
        });
        if (zipcodefee.length > 0) {
            deliveryFee = zipcodefee[0].Delivery_Fee;
        }
    }
    if (deliveryFee == -100 || deliveryFee == undefined || String(deliveryFee) == '' || deliveryFee == null) {
        // get city based delivery fee
        if (city != undefined && city != null && city != '') {
            var cityfee = $.grep(cityDeliveryFee, function (value, idx) {
                return value.Store_id == shopId && String(value.City).toLowerCase() == String(city).toLowerCase();
            });
            if (cityfee.length > 0) {
                deliveryFee = cityfee[0].Delivery_Fee;
            }
        }
    }
    if (deliveryFee == -100 || deliveryFee == undefined || String(deliveryFee) == '' || deliveryFee == null) {
        // check home city 
        var homeCity = $.grep(deliveryFees, function (value, idx) {
            return value.ParamName == 'Home City';
        });
        if (city != undefined && city != '' && city != null && homeCity != '' && homeCity != null && homeCity != undefined) {
            // check selected city  home country 
            if ($.trim(city).toLowerCase() == $.trim(homeCity[0].ParamValue).toLowerCase()) {
                // get delivery fee from home city
                var homecityfee = $.grep(deliveryFees, function (value, idx) {
                    return value.ParamName == 'Home City Delivery Fee';
                });
                if (homecityfee.length > 0)
                { deliveryFee = homecityfee[0].ParamValue; }
            }
            else {
                // get delivery fee from outside city
                var outcityfee = $.grep(deliveryFees, function (value, idx) {
                    return value.ParamName == 'Outside Home City Delivery Fee';
                });
                if (outcityfee.length > 0)
                { deliveryFee = outcityfee[0].ParamValue; }
                console.log('outcityfee' + outcityfee);
            }
        }
    }

    return deliveryFee;
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = mm + '/' + dd + '/' + yyyy;
    //document.getElementById("DATE").value = today;
    return today;
}
function getFreshWidget() {



    var urlValue = getRootUrl() + "Common/FreshWidgetData";
    var Email = '';
    var Shopid = GetShopidforFreshTicket();
    IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
            ShopID: Shopid
        },
        datatype: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    Email = response[0].shop_email;
                    //   FreshWidget.init("", { "queryString": "&helpdesk_ticket[requester]={{user.email}}&helpdesk_ticket[subject]={{user.subject}}&helpdesk_ticket[custom_field][phone_number]={{user.phone}}&helpdesk_ticket[custom_field][product_id]={{helpdesk.product}}", "widgetType": "popup", "buttonType": "image", "buttonText": "Support", "buttonColor": "white", "buttonBg": "#006063", "alignment": "3", "offset": "-1500px", "formHeight": "500px", "url": "https://hanasoftware.freshdesk.com" });
                    //   FreshWidget.init("", { "queryString": "&helpdesk_ticket[requester]=" + response[0].shop_email + "&helpdesk_ticket[subject]=''&helpdesk_ticket[custom_field][phone_number]=" + response[0].SHOP_PHONE + "&helpdesk_ticket[custom_field][product_id]={{helpdesk.product}}", "widgetType": "popup", "buttonType": "image", "buttonText": "Support", "buttonColor": "white", "buttonBg": "#006063", "alignment": "3", "offset": "-1500px", "formHeight": "500px", "url": "https://hanasoftware.freshdesk.com" });
                    //    setTimeout(function () {
                    //        FreshWidget.show();
                    //     }, 1000);
                    //   $('helpdesk_ticket_email').val(response[0].shop_email);
                    //  = response;
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return Email;
}

function GetShopidforFreshTicket() {
    var Shopid = getCookie('ShopID');
    console.log(Shopid);
    if (Shopid.indexOf(",") > 0) {
        Shopid = null;
    }
    console.log('Shopid');
    console.log(Shopid);

    if (Shopid == null || Shopid == undefined || Shopid == '') {
        console.log(userShopList);
        if (userShopList == undefined || userShopList == null && userShopList == '') {
            getShopDetailsForCurrUser();
        }
        var shopobject = $.grep(userShopList, function (n, i) {
            return (n.defaultflg == 'Y');
        });
        if (shopobject != null && shopobject != '' && shopobject != null) {
            Shopid = shopobject[0].SHOP_CODE;
        }
        else {

            Shopid = userShopList[0].SHOP_CODE;
        }

    }
    console.log(Shopid);
    return Shopid;
}

function GetfaqQuestion() {
    var Qry = $('#hana-faq-txt-search').val();
    var urlValue = getRootUrl() + "Common/FAQData";
    var Email = '';
    // IncreaseAjaxCount();
    $.ajax({
        url: urlValue,
        method: 'GET',
        async: false,
        data: {
            qry: Qry
        },
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            //     DecreaseAjaxCount();
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    var source = $("#FAQTemplate").html();
                    var compiledTemplate = Handlebars.compile(source);
                    var compiledHtml = compiledTemplate(JSON.parse(response));
                    $('#hana-faq-content').html(compiledHtml);
                    $('#file_input').multifile();
                    //$('#grid-action-modal-body').html(compiledHtml);
                    //$('.fullview-action-container-close-icon').addClass('hidden');
                    //$('.modal-action-container-close-icon').removeClass('hidden');
                    //$("#grid-action-modal").modal({
                    //    // width: 700,
                    //    keyboard: false,
                    //    modal: true,
                    //    close: function (event, ui) {
                    //        $("#grid-action-modal-body").html('');
                    //    }
                    //});
                }
                else {
                    redirectToLogin();
                }
            }
        },
        error: function (errorObj) {
            //  DecreaseAjaxCount();
            //redirect to common error page
            console.log(errorObj);
        }
    });
}
$(document).on("click", "#btnAttachment", function (e) {
    $('.files').last().click();
    //var filelength = $('.files').length-1;
    //if (filelength == 0) {
    //    $("#file_input").click();
    //}
    //else {
    //    $("#file_input" + filelength).click();
    //}
    //$('#file_input').trigger('click');
});
function showfaq(ID) {
    $('.hana-faq-ans').removeClass('hidden');
    $('#hana-faq-ans-back').removeClass('hidden');
    $('.hana-ans-title-link').html('');
    $('.hana-article--content').html('');
    $('.search-form').addClass('hidden');
    $('.hana-faq-questions').addClass('hidden');
    $('.hana-faq-ans-back').removeClass('hidden');
    var urlValue = getRootUrl() + "Common/FAQAnsData";
    var Email = '';
    IncreaseAjaxCount('hana-faq-ans');
    $.ajax({
        url: urlValue,
        method: 'GET',
        data: {
            ID: ID
        },
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response, status, jqXHR) {
            DecreaseAjaxCount('hana-faq-ans');
            if (response != null && response != null) {
                if (typeof response == "string" && response.length > 2 && response.startsWith("Error") == true) {
                }
                else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                    var Data = JSON.parse(response);
                    $('.hana-faq-ans').removeClass('hidden');
                    $('#hana-article--title').text(Data.Data[0].Question);
                    var redirecturl = getRootUrl() + 'Florist_MachedQuery.aspx?question=' + Data.Data[0].Question;
                    $('#hana-article--title').attr('href', redirecturl);
                    $('#article--open-original').attr('href', redirecturl);
                    $('.hana-article--content').html(Data.Data[0].Answer);
                    //  
                    //var source = $("#FAQTemplate").html();
                    //var compiledTemplate = Handlebars.compile(source);
                    //var compiledHtml = compiledTemplate(JSON.parse(response));
                }
                else {
                    redirectToLogin('hana-faq-ans');
                }
            }
        },
        error: function (errorObj) {
            DecreaseAjaxCount('hana-faq-ans');
            //redirect to common error page
            console.log(errorObj);
        }
    });
    return false;
}
function backtoFAQ() {
    $('.search-form').removeClass('hidden');
    $('#hana-btn-open-ticket').removeClass('hidden');
    $('#hana-btn-view-ticket').removeClass('hidden');
    $('.hana-faq-questions').removeClass('hidden');
    $('.hana-faq-ans').addClass('hidden');
    $('.hana-faq-submit-tickets').addClass('hidden');
    $('#hana-faq-ans-back').addClass('hidden');
    $('#hana-btn-submit-ticket').addClass('hidden');
    $('.search-actions').removeClass('hidden');
    $('.hana-faq-submit-ticket-status').hide();
}
function openticketmodal() {
    $('#hana-btn-open-ticket').addClass('hidden');
    $('#hana-btn-view-ticket').addClass('hidden');
    $('.hana-faq-questions').addClass('hidden');
    $('.hana-faq-ans').addClass('hidden');
    $('.search-form').addClass('hidden');
    $('.hana-faq-submit-tickets').removeClass('hidden');
    $('#hana-faq-ans-back').removeClass('hidden');
    $('#hana-btn-submit-ticket').removeClass('hidden');
    var custemail = getFreshWidget();
    $('#txtfaqemail').val(custemail);
    $('#txtfaqsubject').focus();
    //######################################################
    //multiple file upload
    // Checking whether FormData is available in browser
    //if (window.FormData !== undefined) {
    //    var fileUpload = $("#fuFeedBackImgages").get(0);
    //    var files = fileUpload.files;
    //    // Create FormData object
    //    var fileData = new FormData();
    //    // Looping over all files and add it to FormData object
    //    for (var i = 0; i < files.length; i++) {
    //        fileData.append(files[i].name, files[i]);
    //    }
    //    // Adding one more key to FormData object          
    //    fileData.append('Comments', $('#txtComments').val());
    //    fileData.append('ScreenShotImageSource', imageSource);
    //    var urlValue = getRootUrl() + 'Common/SaveFeedBack';
    //    // IncreaseAjaxCount();
    //    //$.ajax({
    //    //    url: urlValue,
    //    //    type: "POST",
    //    //    contentType: false, // Not to set any content header
    //    //    processData: false, // Not to process data
    //    //    data: fileData,
    //    //    success: function (result) {
    //    //        DecreaseAjaxCount();
    //    //        
    //    //        if (result.IsSuccess) {
    //    //            toastr.success(result.Message);
    //    //        }
    //    //        else {
    //    //            toastr.error(result.Message);
    //    //        }
    //    //    },
    //    //    error: function (err) {
    //    //        DecreaseAjaxCount();
    //    //        //redirect to common error page
    //    //        console.log(errorObj);
    //    //    }
    //    //});
    //} else {
    //    toastr.error("FormData is not supported.");
    //}
}
function SubmitTicket() {

    // GetShopidforFreshTicket();

    var Error = '';
    var Invoice = $('#txtfaqinvoice').val();
    var Description = '';
    if (Invoice != '') {
        Description = 'Invoice :' + Invoice + '<br/>' + $('#txtfaqdesc').val();
    }
    else {
        Description = $('#txtfaqdesc').val();
    }
    var Email = $('#txtfaqemail').val();
    var Subject = $('#txtfaqsubject').val();
    var Priority = $('#ddlfaqpriority').val();
    var Type = $('#ddlfaqtype').val();
    // var Status = $('#ddlfaqtype').val();
    var Status = '2';
    var yourdomain = 'hanasoftware'; // Your freshdesk domain name. Ex., yourcompany
    var api_key = 'p84X5bXBhmQdFU1XBScE'; // Ref: https://support.freshdesk.com/support/solutions/articles/215517-how-to-find-your-api-key
    if (Email == '') {
        $('#txtfaqemail').parent().addClass('has-error');
        $('#txtfaqemail').focus();
        return false;
    }
    else {
        $('#txtfaqemail').parent().removeClass('has-error');
    }
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (pattern.test(Email) == false) {
        $('#txtfaqemail').parent().addClass('has-error');
        $('#txtfaqemail').focus();
        return false;
    }
    else {
        $('#txtfaqemail').parent().removeClass('has-error');
    }
    if (Subject == '') {
        $('#txtfaqsubject').parent().addClass('has-error');
        $('#txtfaqsubject').focus();
        return false;
    }
    else {
        $('#txtfaqsubject').parent().removeClass('has-error');
    }
    if (Description == '') {
        $('#txtfaqdesc').parent().addClass('has-error');
        $('#txtfaqdesc').focus();
        return false;
    }
    else {
        $('#txtfaqdesc').parent().removeClass('has-error');
    }
    if (Type == '--Select Type--') {
        $('#ddlfaqtype').parent().addClass('has-error');
        $('#ddlfaqtype').focus();
        return false;
    }
    else {
        $('#ddlfaqtype').parent().removeClass('has-error');
    }
    if (Priority == '--Select Priority--') {
        $('#ddlfaqpriority').parent().addClass('has-error');
        $('#ddlfaqpriority').focus();
        return false;
    }
    else {
        $('#ddlfaqpriority').parent().removeClass('has-error');
    }
    //$('#txtfaqinvoice').parent().addClass('has-error');
    var formdata = new FormData();
    formdata.append('description', Description);
    formdata.append('email', Email);
    formdata.append('subject', Subject);
    formdata.append('priority', Priority);
    // formdata.append('status', Status);
    formdata.append('status', '2');
    var TotalSize = 0;
    //15000000
    for (i = 0; i < $('.files').length - 1; i++) {
        TotalSize = parseInt(TotalSize) + parseInt($('.files')[i].files[0].size);
        formdata.append('attachments[]', $('.files')[i].files[0]);
    }
    var imageSource = $('#imgPreview').attr('src');
    if (imageSource != "" && imageSource != undefined) {
        var blob = dataURItoBlob(imageSource);
        var date = new Date();
        var filename = (date.getMonth() + 1) + '_' + date.getDate() + '_' + date.getFullYear() + '_' + getRandomInt(1, 1000000000);
        TotalSize = parseInt(TotalSize) + parseInt(blob.size);
        formdata.append('attachments[]', blob, filename + ".png");
    }
    //   var MaxSize = 755820  //Testing 
    var MaxSize = 15728640; // 15 MB
    if (TotalSize > MaxSize) {
        toastr.error('Attachment size limit exceed');
        return false;
    }
    $.ajax(
      {
          url: "https://" + yourdomain + ".freshdesk.com/api/v2/tickets",
          type: 'POST',
          contentType: false,
          processData: false,
          headers: {
              "Authorization": "Basic " + btoa(api_key + ":x")
          },
          data: formdata,
          success: function (data, textStatus, jqXHR) {
              $('#result').text('Success');
              $('#code').text(jqXHR.status);
              $('#response').html(JSON.stringify(data, null, "<br/>"));
              $('.hana-faq-submit-ticket-status').show();
              $('#hana-faq-ans-back').removeClass('hidden');
              $('.search-form').addClass('hidden');
              $('.search-actions').addClass('hidden');
              $('.hana-faq-submit-tickets').addClass('hidden');
              $('#txtfaqinvoice').val('');
              $('#txtfaqdesc').val('');
              $('#txtfaqsubject').val('');
              $('#ddlfaqpriority').val('--Select Priority--');
              $('#ddlfaqtype').val('--Select Type--');
          },
          error: function (jqXHR, tranStatus) {
              $('#result').text('Error');
              $('#code').text(jqXHR.status);
              x_request_id = jqXHR.getResponseHeader('X-Request-Id');
              response_text = jqXHR.responseText;
              $('#response').html(" Error Message : <b style='color: red'>" + response_text + "</b>.<br/> Your X-Request-Id is : <b>" + x_request_id + "</b>. Please contact support@freshdesk.com with this id for more information.");
          }
      }
    );
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    var ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    blob.name = "CaptureImage.png";
    return blob;
}
//$('.hana-faq-submit-tickets').removeClass('hidden');
//$('.hana-faq-ans-back').removeClass('hidden');
//// $('.contact--submit').removeClass('hidden');
////  $('#hana-btn-open-ticket').addClass('hidden');
////######################################################
//var imageSource = $('#imgPreview').attr('src');
////multiple file upload
//    // Checking whether FormData is available in browser
//    if (window.FormData !== undefined) {
//        var fileUpload = $("#fuFeedBackImgages").get(0);
//        var files = fileUpload.files;
//        // Create FormData object
//        var fileData = new FormData();
//        // Looping over all files and add it to FormData object
//        for (var i = 0; i < files.length; i++) {
//            fileData.append(files[i].name, files[i]);
//        }
//        // Adding one more key to FormData object          
//        fileData.append('Comments', $('#txtComments').val());
//        fileData.append('ScreenShotImageSource', imageSource);
//        var urlValue = getRootUrl() + 'Common/SaveFeedBack';
//        IncreaseAjaxCount();
//        $.ajax({
//            url: urlValue,
//            type: "POST",
//            contentType: false, // Not to set any content header
//            processData: false, // Not to process data
//            data: fileData,
//            success: function (result) {
//                DecreaseAjaxCount();
//                
//                if (result.IsSuccess) {
//                    toastr.success(result.Message);
//                }
//                else {
//                    toastr.error(result.Message);
//                }
//            },
//            error: function (err) {
//                DecreaseAjaxCount();
//                //redirect to common error page
//                console.log(errorObj);
//            }
//        });
//    } else {
//        toastr.error("FormData is not supported.");
//    }
//}
function truncate(n, len) {
    var ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
    var filename = n.replace('.' + ext, '');
    if (filename.length <= len) {
        return n;
    }
    filename = filename.substr(0, len) + (n.length > len ? '[...]' : '');
    return filename + '.' + ext;
};
function generateGoogleGeocodingUrl(zipcode) {
    if (zipcode != null && zipcode != undefined && zipcode != '')
    { return googleGeocodingApiBaseUrl + '?key=' + googleApiKey + '&address=' + zipcode + '&sensor=true'; }
    else
    {
        return {};
    }
}
function ReturnAddressDetailsByZipcode(zipcode) {
    // setTimeout(function(){
    //var addressDetails = {};
    //if (zipcode != "" && zipcode != null && zipcode!=undefined) {
    //    var zipcodeValue = zipcode;
    //    var url = generateGoogleGeocodingUrl(zipcodeValue);
    //    $.get(url, function (data, status) {
    //        if (status != undefined && status != null && status == 'success') {
    //            if (data != undefined && data != null && data.status.toLowerCase() == 'ok') {
    //                if (data.results != undefined && data.results != null && data.results.length > 0) {
    //                       addressDetails = data.results[0].address_components;
    //                      return addressDetails;
    //                }
    //            }
    //        }
    //        else {
    //            if (status == 'timeout') {
    //                console.log('The server is not responding');
    //            }
    //            if (status == 'error') {
    //                console.log(data);
    //            }
    //            return addressDetails;
    //        }
    //    });
    //}
    //}, 2000);
    var city = '';
    var state = '';
    var country = '';
    var addressDetails = {};
    var Data = [];
    var zipcodeValue = zipcode;
    var url = generateGoogleGeocodingUrl(zipcodeValue);
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        data: {},
        success: function (data) {
            if (data != undefined && data != null && data.status.toLowerCase() == 'ok') {
                if (data.results != undefined && data.results != null && data.results.length > 0) {
                    addressDetails = data.results[0].address_components;
                    $.each(addressDetails, function (idx, addrPart) {
                        if (addrPart.types.length > 0) {
                            if (addrPart.types.indexOf('locality') > -1 || addrPart.types.indexOf('neighborhood') > -1) {
                                city = addrPart.long_name;
                            }
                            else if (addrPart.types.indexOf('administrative_area_level_1') > -1) {
                                state = addrPart.short_name;
                            }
                            else if (addrPart.types.indexOf('country') > -1) {
                                country = addrPart.short_name;
                            }
                        }
                    });
                    Data.push({ City: city, State: state, Country: country });
                }
            }
        }
    });
    return Data;
}
function GetGiftCardNumberInfo(CardNumber, ShopId) {
    var GiftCardDetails = "";
    if (CardNumber != null && CardNumber != "" && CardNumber != undefined) {
        $.ajax({
            //url: getRootUrl() + "Order/CheckCardNumberExistInGiftCardDetails",
            url: getRootUrl() + "Order/GetGiftCardDetails",
            data: { CardNumber: CardNumber, ShopId: ShopId },
            type: 'POST',
            async: false,
            success: function (result) {
                if (result.IsSuccess) {
                    if (result.data != "" && result.data != "") {
                        GiftCardDetails = JSON.parse(result.data);
                    }
                }
                else {
                    toastr.error(result.Message);
                }
            },
            error: function (jqXHR, status, err) {
                toastr.error("Something went wrong");
            }
        });
    }
    return GiftCardDetails;
}

function prefixDollar(value, decimal) {
    if (decimal == undefined || decimal == null) {
        decimal = 2;
    }
    else {
        decimal = parseInt(decimal);
    }
    value = formatNumberValue(value, decimal);
    if (value.indexOf('$') == -1) {
        value = '$' + value;
    }
    return value;
}

function formatNumberValue(numberValue, decimals) {
    if (decimals == undefined || decimals == null) {
        decimals = 2;
    }
    else {
        decimals = parseInt(decimals);
    }
    var value = String(numberValue);
    if (parseVariable(value)) {
        if (value.indexOf('$') > -1) {
            value = value.replace('$', '');
        }
        value = parseFloat(value);
        value = value.toFixed(decimals);
    }
    return value;
}

function ReadQueryString(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



// Calculate tax  changes to include proposal tax calculation comman
// Added SetupFeeAmt, SetupTaxflg for Calcualte Proposal Tax with in common methods . on 05/26/2018
function CalculateTaxBasedOnTaxableAmt(taxpercentage, taxableAmt, discountAmt, deliveryFeeAmt, relayFeeAmt, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, SetupFeeAmt, SetupTaxflg) {
    var taxAmt = 0;

    // if (taxableAmt > 0) {
    if ($.trim(DeliveryTaxflg).toLowerCase() == 'yes') {

        taxableAmt += deliveryFeeAmt;
    }
    if ($.trim(RelayTaxflg).toLowerCase() == 'yes') {
        taxableAmt += relayFeeAmt;
    }

    //SetupFeeAmt, SetupTaxflg
    if (SetupTaxflg != undefined) {
        if ($.trim(SetupTaxflg).toLowerCase() == 'yes') {
            taxableAmt += SetupFeeAmt;
        }
    }


    if ($.trim(DiscountTaxflg).toLowerCase() != 'yes') {
        taxableAmt -= discountAmt;
    }

    if (taxpercentage > 0) {
        taxAmt = (taxableAmt * taxpercentage) / 100;
    }
    //  }

    return taxAmt;
}
// Added SetupFeeAmt, SetupTaxflg by nanda for Calcualte Proposal Tax with in common methods . on 05/26/2018
// Added ShopID,ShopState by nanda for Calcualte Proposal Tax with in common methods . on 06/09/2018
function CalculateTaxCommon(subTotal, discountAmt, deliveryFeeAmt, relayFeeAmt, Taxpercentage, PSTpercentage, GSTpercentage, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, IsCanadaTax, TaxState, SetupFeeAmt, SetupTaxflg, ShopID, ShopState, CalGSTflg, CalPSTflg, CalHSTflg, CalQSTflg) {

    // here  subTotal with out discount (all taxable products sum of amount)
    var PSTAmount = 0;
    var GSTAmount = 0;
    var TAXAmount = 0;
    var HSTAmount = 0;
    var QSTAmount = 0;
    var RelayFeeTaxAmt = 0;
    var TaxAmounts = [];
    var data = {};
    var totalAmt = subTotal;


    if (IsCanadaTax == "Y") {

        var GSTpercent = 0;
        var PSTpercent = 0;
        var HSTpercent = 0;
        var QSTpercent = 0;

        var GSTRelaypercent = 0;
        var PSTRelaypercent = 0;
        var HSTRelaypercent = 0;
        var QSTRelaypercent = 0;

        var CanadaTaxDetails = getCanadaTaxList(TaxState);
        if (CanadaTaxDetails != undefined && CanadaTaxDetails != null && CanadaTaxDetails != '') {
            GSTpercent = CanadaTaxDetails[0].GST;
            PSTpercent = CanadaTaxDetails[0].PST;
            HSTpercent = CanadaTaxDetails[0].HST;
            QSTpercent = CanadaTaxDetails[0].QST;
        }

        // Added By nanda to get the Tax % based on the ShopState . on 060918

        var CanadaShopTaxDetails = getCanadaTaxList(ShopState);
        if (CanadaShopTaxDetails != undefined && CanadaShopTaxDetails != null && CanadaShopTaxDetails != '') {

            GSTRelaypercent = CanadaShopTaxDetails[0].GST;
            PSTRelaypercent = CanadaShopTaxDetails[0].PST;
            HSTRelaypercent = CanadaShopTaxDetails[0].HST;
            QSTRelaypercent = CanadaShopTaxDetails[0].QST;
        }

        //  if (parseFloat(GSTpercent) > 0) {
        // updated relayfeeamount to 0 by nanda for Calculate Relay fee based on the shop state. on 060918
        GSTAmount = CalculateTaxBasedOnTaxableAmt(GSTpercent, totalAmt, discountAmt, deliveryFeeAmt, 0, 'yes', 'yes', DiscountTaxflg, SetupFeeAmt, SetupTaxflg);
        // Added By Nanda to get the relayfee tax based on the shop state on 060918
        var GSTRelayAmt = CalculateRelayFeeTax(GSTRelaypercent, relayFeeAmt, RelayTaxflg);
        RelayFeeTaxAmt = GSTRelayAmt;
        GSTAmount = (Math.round(GSTAmount * 100) / 100);
        // Hided By Nanda to remove 2 time Calc GST amount on 061718
        //GSTAmount += GSTAmount + GSTRelayAmt;
        GSTAmount = GSTAmount + GSTRelayAmt;

        if (GSTAmount < 0) {
            GSTAmount = 0;
        }

        // hided by nanda for Calculate Relay fee based on the shop state. on 060918
        //RelayFeeTaxAmt = CalculateTaxBasedOnTaxableAmt(GSTpercent, relayFeeAmt, 0, 0, 0, 'no', 'yes', 'no', SetupFeeAmt, SetupTaxflg);
        //RelayFeeTaxAmt = (Math.round(RelayFeeTaxAmt * 100) / 100);
        //if (RelayFeeTaxAmt < 0) {
        //    RelayFeeTaxAmt = 0;
        //}
        //   }
        //     if (parseFloat(PSTpercent) > 0) {
        // updated relayfeeamount to 0 by nanda for Calculate Relay fee based on the shop state. on 060918
        PSTAmount = CalculateTaxBasedOnTaxableAmt(PSTpercent, totalAmt, discountAmt, deliveryFeeAmt, 0, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, SetupFeeAmt, SetupTaxflg);
        // Added By Nanda to get the relayfee tax based on the shop state on 060918
        var PSTRelayAmt = CalculateRelayFeeTax(PSTRelaypercent, relayFeeAmt, RelayTaxflg);
        RelayFeeTaxAmt += PSTRelayAmt;
        PSTAmount = (Math.round(PSTAmount * 100) / 100);
        PSTAmount = PSTAmount + PSTRelayAmt;
        if (PSTAmount < 0) {
            PSTAmount = 0;
        }
        //    }
        //     if (parseFloat(HSTpercent) > 0) {
        // updated relayfeeamount to 0 by nanda for Calculate Relay fee based on the shop state. on 060918
        HSTAmount = CalculateTaxBasedOnTaxableAmt(HSTpercent, totalAmt, discountAmt, deliveryFeeAmt, 0, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, SetupFeeAmt, SetupTaxflg);

        // Added By Nanda to get the relayfee tax based on the shop state on 060918
        var HSTRelayAmt = CalculateRelayFeeTax(HSTRelaypercent, relayFeeAmt, RelayTaxflg);
        RelayFeeTaxAmt += HSTRelayAmt;
        HSTAmount = (Math.round(HSTAmount * 100) / 100);
        HSTAmount = HSTAmount + HSTRelayAmt;
        if (HSTAmount < 0) {
            HSTAmount = 0;
        }
        //     }
        //      if (parseFloat(QSTpercent) > 0) {
        // updated relayfeeamount to 0 by nanda for Calculate Relay fee based on the shop state. on 060918
        QSTAmount = CalculateTaxBasedOnTaxableAmt(QSTpercent, totalAmt, discountAmt, deliveryFeeAmt, 0, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, SetupFeeAmt, SetupTaxflg);

        // Added By Nanda to get the relayfee tax based on the shop state on 060918
        var QSTRelayAmt = CalculateRelayFeeTax(QSTRelaypercent, relayFeeAmt, RelayTaxflg);
        RelayFeeTaxAmt += QSTRelayAmt;
        QSTAmount = (Math.round(QSTAmount * 100) / 100);
        QSTAmount = QSTAmount + QSTRelayAmt;
        if (QSTAmount < 0) {
            QSTAmount = 0;
        }
        //    }


        // Added By nanda check the flag and calculate on 112718

        if (CalGSTflg == 'N') {
            GSTAmount = 0;
        }
        if (CalPSTflg == 'N') {
            PSTAmount = 0;
        }
        if (CalHSTflg == 'N') {
            HSTAmount = 0;
        }
        if (CalQSTflg == 'N') {
            QSTAmount = 0;
        }

        TAXAmount = parseFloat(PSTAmount) + parseFloat(GSTAmount) + parseFloat(HSTAmount) + parseFloat(QSTAmount);


    }
    else {
        TAXAmount = CalculateTaxBasedOnTaxableAmt(Taxpercentage, totalAmt, discountAmt, deliveryFeeAmt, relayFeeAmt, DeliveryTaxflg, RelayTaxflg, DiscountTaxflg, SetupFeeAmt, SetupTaxflg);
        TAXAmount = (Math.round(TAXAmount * 100) / 100)
    }

    if (TAXAmount < 0) {
        TAXAmount = 0;
    }

    data.PST = parseFloat(PSTAmount);
    data.GST = parseFloat(GSTAmount);
    data.HST = parseFloat(HSTAmount);
    data.QST = parseFloat(QSTAmount);
    data.TAX = parseFloat(TAXAmount);
    data.IsCanadaTax = IsCanadaTax;
    data.RelayFeeTaxAmt = parseFloat(RelayFeeTaxAmt);

    TaxAmounts.push(data);

    return TaxAmounts;
}
// Added By nanda to get relay fee tax based on the shop state on 060918
function CalculateRelayFeeTax(Taxpercentage, relayFeeAmt, RelayTaxflg) {
    var TaxableAmt = 0;
    var TaxAmt = 0;
    if (parseFloat(Taxpercentage) > 0) {
        if ($.trim(RelayTaxflg).toLowerCase() == 'yes') {
            TaxableAmt += relayFeeAmt;
        }
        if (Taxpercentage > 0) {
            TaxAmt = (TaxableAmt * Taxpercentage) / 100;
        }
        TaxAmt = (Math.round(TaxAmt * 100) / 100);
        if (TaxAmt < 0) {
            TaxAmt = 0;
        }
    }
    return TaxAmt;

}



function GetCouponDetails(couponCode, selectedShopId, totalAmounut) {
    var CouponDetails = [];
    var data = {};
    var couponpercent = "0";
    var couponamount = "0";
    var couponerror = "Coupon Code Is In-valid";
    if (parseVariable(couponCode)) {
        //  var urlLink = getRootUrl() + "Order/getCouponDiscountAmt";
        var urlLink = getRootUrl() + "Common/GetCouponAmounts";
        $.ajax({
            url: urlLink,
            method: "POST",
            data: {
                couponCode: couponCode, shopId: selectedShopId, SubTotal: totalAmounut
            },
            async: false,
            success: function (response, status, jqXHR) {
                if (response != null && response != null && response.length > 0) {
                    if (response.startsWith("Error") == true) {
                        //redirect to common error page
                        var errorMsg = response.replace("Error:", "");
                        couponerror = errorMsg;

                    }
                    else if (jqXHR.getResponseHeader('content-type').indexOf('text/html') == -1) {
                        var couponDetails = JSON.parse(response);
                        if (couponDetails != undefined && couponDetails != null && couponDetails.length > 0) {
                            couponDetails = couponDetails[0];
                            couponpercent = couponDetails.couponpercent;
                            couponamount = couponDetails.couponamount;
                            couponerror = couponDetails.Error;

                        }
                    }
                    else {
                        redirectToLogin();
                    }
                }
            },
            error: function (errorObj) {
                //redirect to common error page
                console.log(errorObj);
            }
        });
    }
    data.couponpercent = couponpercent;
    data.couponamount = couponamount;
    data.couponerror = couponerror;
    CouponDetails.push(data);
    return CouponDetails;
}

$(document).ready(function () {

    //   (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) || /CriOS/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))


    if (navigator.userAgent.search("Chrome") < 0 && navigator.userAgent.search("CriOS") < 0) {
        //  if((/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) || /CriOS/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))==false) {
        //  alert("Browser is Chrome");
        toastr.options = {
            "positionClass": "toast-top-full-width",
            "closeButton": false,
            timeOut: 0,
            extendedTimeOut: 0
        }
        showBrowserWarningToastr('WARNING: hana is optimized for Google Chrome. Please open Hana POS in google Chrome for best experience.', "");
    }

});

//toast-bottom-center
function showBrowserWarningToastr(messageDescription) {

    toastr.options = {
        "positionClass": "toast-bottom-center",
        "closeButton": false,
        timeOut: 0,
        extendedTimeOut: 0
    }
    toastr.error(messageDescription, "");

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "progressBar": true,
        "preventDuplicates": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "400",
        "hideDuration": "1000",
        "timeOut": timeout,
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

}
function IsNullOrEmptyOrUndefined(value) {
    var result = false;
    if (value == "" || value == null || value == undefined || value == "undefined" || value == "--select--") {
        result = true;
    }
    return result;
}


function GetReportFormatDetails(ReportTypeID, DefaultFomatid) {

    var option = '<option data-id="--select--"  value="--select--">--select--</option>';
    var list = option;

    $.ajax({
        url: getRootUrl() + "Common/GetReportFormat",
        data: { ReportTypeID: ReportTypeID },
        type: 'GET',
        async: false,

        success: function (response) {
            if (response.startsWith("Error") == true) {
                showErrorToastr('Error', 'Some Error Occurred.');

            }
            else {
                var ReportFormatList = JSON.parse(response);

                for (var i = 0; i < ReportFormatList.length; i++) {
                    var ReportList = ReportFormatList[i];

                    var value = ReportList.Report_Details_id;
                    var text = ReportList.reportname;
                    var Id = ReportList.ReportId;
                    if (DefaultFomatid == Id) {
                        option = '<option selected data-id="' + Id + '"  value="' + value + '">' + text + '</option>';
                    }
                    else {
                        option = '<option  data-id="' + Id + '"  value="' + value + '">' + text + '</option>';
                    }

                    list += option;
                }

            }
        },
        error: function (jqXHR, status, err) {
            showErrorToastr("Error", 'Something went wrong');
        }
    });

    return list;

}
function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}


// Phone No Validation Added By Nanda on 100418
//Use on  Keyup  example onkeyup="onKeyUpPhoneFormat(event, 'custPhone')"

function onKeyUpPhoneFormat(e, classname) {
    if (e.which != 9) {
        var value = $("." + classname).val();
        // Added By nanda replace space to empty on 073118
        value = value.replace(' ', '');

        if (value != '' && $.trim(value) != '') {
            // var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
            var numberRegex = /^\d+(-\d+)*$/;
            if (numberRegex.test(value)) {
                value = value.replace(/-/i, '');
                //if (value.length == 3) {
                //    var formattedPhoneNumber = value.substring(0, 3) + '-';
                //    $("." + classname).val(formattedPhoneNumber);
                //}
                //  if (value.length == 7 || value.length ==10 ) {
                if (value.length == 10) {
                    value = value.replace(/-/i, '');
                    var formattedPhoneNumber = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
                    $("." + classname).val(formattedPhoneNumber);
                }

            }

        }
    }
}

// Use on keypress like onkeypress="return isPhoneKey(this)"
function isPhoneKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    //console.log(charCode);
    //charCode != 46  Dot
    if (charCode != 45 && charCode > 31
    && (charCode < 48 || charCode > 57))
        return false;

    return true;
}


// Validate Email 

// should be True then valid ex if(isEmailValid(ctrlValue))
function isEmailValid(email) {
    // var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var expr = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expr.test(email);
};

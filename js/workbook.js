//var caseId = 'E1706170812';
var caseId = 'N0003000069';

function getServiceUrl(datasource) {
	var serviceURL = "https://mcr-cc.test.cognosante.cc:443";
	//var serviceURL = "https://impl.cerrs-mcr.cms.gov";	
	var midasServicePath = '/database/v1/consumer/get-hics-miniworkbook-midas-data';
    var ffmServicePath = '/database/v1/consumer/get-hics-miniworkbook-ffm-data';
    var rcnoServicePath = '/database/v1/consumer/get-hics-miniworkbook-rcno-data';			    
	//console.log("CaseId = " + caseId);
	
	if(datasource === 'MIDAS') {
		serviceURL = serviceURL + midasServicePath;
	}
	
	if(datasource === 'FFM') {
		serviceURL = serviceURL + ffmServicePath;
	}
	
	if(datasource === 'RCNO') {
		serviceURL = serviceURL + rcnoServicePath;
	}	
	//console.log("Full Service URL = " + serviceURL);
  return serviceURL;	
}

var serviceApiKey = "6d5d56f7cf494134a96cc6910549341a";
var app = angular.module("workbook", []);

app.service("Service", function ($http) {    
    this.GetListMIDAS = function () {      
        var response = $http({
            method: "POST",
			url : getServiceUrl('MIDAS'),          		
            headers: {
                'x-cognosante-authentication': serviceApiKey
            },
            data: JSON.stringify({ "caseId": caseId }),
            dataType: "json"
        });
        return response;
    }
    
    this.GetListFFM = function(){
        var response = $http({
            method: "POST",
			url: getServiceUrl('FFM'),					
			headers: {
                'x-cognosante-authentication': serviceApiKey
            },
            data: JSON.stringify({ "caseId": caseId }),
            dataType: "json"
        });
        return response;
    }
    
     this.GetListRCNO = function(){
        var response = $http({
            method: "POST",
			url: getServiceUrl('RCNO'),	           
            headers: {
                'x-cognosante-authentication': serviceApiKey
            },
            data: JSON.stringify({ "caseId": caseId }),
            dataType: "json"
        });
        return response;
    }
});

app.filter('dateconversion', function () {
    return function (input) {
		var output = '';	
		if(input)
	    {
			var year = input.substring(0, 4);
			var mnth = input.substring(4, 6);
			var date = input.substring(6, 8);
			output = mnth + '-' + date + '-' + year;
			return output;			
		}
		else
		{
			return output;	       
		}
    };
});

app.controller("workbookcontroller", function ($scope, Service) {
    $scope.TableName = "MIDAS";

    $scope.sort = {
        column: '',
        descending: false
    };

    $scope.changeSorting = function (column) {
        var sort = $scope.sort;

        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };

    $scope.fn_GetListMIDAS = function () {
		console.log('Inside MIDAS');
		$scope.ShowLoadingMsg = true;
        var ResponseRegistration = Service.GetListMIDAS();
        ResponseRegistration.then(function (msg) {
            $scope.MIDAS = msg.data.WorkbookResultSet;
			$scope.ShowLoadingMsg = false;
            if($scope.MIDAS.length < 1){
                //console.log('NO DATA FOUND');
                $scope.noMidasDataFlag = true;
            }
        }, function (msg) {  			
			if(msg.status > 1 || msg.status== -1){
			$scope.MidasErrorFlag = true;	
			$scope.ShowLoadingMsg = false;
			$scope.MidasErrorMsg = "ERROR RETRIEVING MIDAS DATA"}			
            console.log("ERROR IN MIDAS TAB:", msg);
        });
    }
    
    function fn_GetListFFm(){
		console.log('Inside FFM');
		$scope.ShowLoadingMsg = true;
        var ResponseRegistration = Service.GetListFFM();
        ResponseRegistration.then(function (msg) {
            $scope.FFMS = msg.data.WorkbookResultSet;
			$scope.ShowLoadingMsg = false;
            $scope.TableName = "FFMEXTRACT";
            if($scope.FFMS.length < 1){
				//console.log('NO DATA FOUND');
                $scope.noFfmDataFlag = true;
            }
        }, function (msg) {     
			if(msg.status > 1 || msg.status== -1){
			$scope.FfmErrorFlag = true;	
			$scope.ShowLoadingMsg = false;
			$scope.FfmErrorMsg = "ERROR RETRIEVING FFM DATA"}			
            console.log("ERROR IN FFM TAB:", msg);
        });
    }
    
    function fn_GetRCNO(){
        console.log('Inside RCNO');
		$scope.ShowLoadingMsg = true;	
        var ResponseRegistration = Service.GetListRCNO();
        ResponseRegistration.then(function (msg) {
            $scope.RCNO = msg.data.WorkbookResultSet;
			$scope.ShowLoadingMsg = false;	
			$scope.TableName = "RCNO";
            if($scope.RCNO.length < 1){
				//console.log('NO DATA FOUND');
                $scope.noRcnoDataFlag = true;
            }
}, function (msg) { 	
			if(msg.status > 1 || msg.status== -1){
			$scope.RcnoErrorFlag = true;
			$scope.ShowLoadingMsg = false;			
			$scope.RcnoErrorMsg = "ERROR RETRIEVING RCNO DATA"}			
            console.log("ERROR IN RCNO TAB:", msg);
        });
    }

    $scope.fn_SetTablename = function (TableNo) {
        if (TableNo == 1) {
            $scope.TableName = "MIDAS";
        }
        if (TableNo == 2) {
            fn_GetListFFm();
        }
        if (TableNo == 3) {
            fn_GetRCNO();
        }        
    };   
});

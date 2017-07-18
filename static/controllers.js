app.controller("DashboardController", function($scope, $location, $http, rawDataService, anchorSmoothScroll, TestingService) {
    $scope.chart;
    $scope.line = "line";
    $scope.bar = "bar";
    $scope.radar = "radar";
    $scope.doughnut = "doughnut";
    $scope.pie = "pie";

    $scope.title = "Analytics Controller";
    $scope.rawData = rawDataService;

    // First Chart, Bar Cgart
    $scope.labelsCategory = asArr(rawTransObj(rawDataService, "Category"), "key");
    $scope.dataCategory = asArr(rawTransObj(rawDataService, "Category"), "value");
    $scope.optionsCategory = dataOptions("Cases per Cateogry");
    $scope.backgroundColor = [
        "#000000", "#000000", "#000000", "#000000",
    ]

    // Second Chart, Bar Chart
    $scope.labelsServicer = asArr(rawTransObj(rawDataService, "Assignee"), "key");
    $scope.dataServicer = asArr(rawTransObj(rawDataService, "Assignee"), "value");
    $scope.optionsServicer = dataOptions("Cases per Asignee");

    // Third Chart, Time Series
    $scope.labelsDate = asArr(rawTransObj(rawDataService, "Date"), "key");
    $scope.dataDate = asArr(rawTransObj(rawDataService, "Date"), "value");
    $scope.optionsDate = dataOptions("# Cases vs Time");

    // Fourth Chart, Doughnut
    $scope.labelsRegion = asArr(rawTransObj(rawDataService, "Region"), "key");
    $scope.dataRegion = asArr(rawTransObj(rawDataService, "Region"), "value");
    $scope.emailsRegion = circleOptions("Cases in Each Region");

    $scope.datasetOverride = [{
        yAxisID: "y-axis-1"
    }, {
        yAxisID: "y-axis-2"
    }];

    $scope.showData = function(event) {
        console.log(event);
    }
    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');
        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
    };
});

app.controller("EmailUsController", function($scope, $location, $http, rawDataService, anchorSmoothScroll) {
    $scope.submitEmail = function(subject, content) {
        if (subject && content) {
            $http.post("/submit", {
                subject: subject,
                content: content
            }).success(function(response){
                this.subject = "";
                this.content = "";
            });
        }
    }
});

app.controller("TicketsController", function($scope, $location, $http, rawDataService, anchorSmoothScroll) {
    $scope.rawData = rawDataService;
    $scope.allCategories = findAllCategories(rawDataService);
    $scope.notHidden = false;
    $scope.leftPaneCaseID;
    $scope.rightPaneCaseID;
    $scope.changeBool = function(row, id) {
        console.log("Row: " + JSON.stringify(row, null, 4));
        console.log("ID: " + id);
        $scope.rightPaneCaseID = id;
        // Right panel opens or close, depending on which button is clicked
        if ($scope.notHidden === false) {
            $scope.notHidden = true
        } else {
            $scope.notHidden = false;
        }
    }
    $scope.modifyCategory = function(modCat, id){
        console.log(id);
        console.log(modCat);
        if(modCat && id){
            // // (REMOVE COMMENT LINE 88-92) Talk to Hemanth on how to send this.
            // // Sends
            // $http.post("", {
            //     Category: modCat,
            //     CaseID: id
            // });
        }
    }
});

// User Defined Functions
function rawTransObj(arr, key) {
    var transObj = {};
    arr.forEach(function(row) {
        if (!transObj[row[key]]) {
            transObj[row[key]] = 1;
        } else {
            transObj[row[key]] += 1;
        }
    })
    return transObj;
}

function asArr(obj, keyOrVal) {
    var retArr = [];
    for (var key in obj) {
        if (keyOrVal === "key") {
            retArr.push(key);
        } else if (keyOrVal === "value") {
            retArr.push(obj[key]);
        }
    }
    return retArr;
}

function circleOptions(titleText) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: titleText,
            fontSize: 20
        }
    }
}

function dataOptions(titleText) {
    return {
        legend: {
            display: false
        },
        elements: {
            line: {
                tension: 0.3,
            }
        },
        title: {
            display: true,
            text: titleText,
            fontSize: 20
        },
        scales: {
            yAxes: [{
                    id: "y-axis-1",
                    type: "linear",
                    display: true,
                    position: "left",
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (Number.isInteger(value)) { return value; } },
                        stepSize: 1
                    }
                },
                {
                    id: "y-axis-2",
                    type: "linear",
                    display: false,
                    position: "right",
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (Number.isInteger(value)) { return value; } },
                        stepSize: 1
                    }
                }
            ]
        }
    }
}

function findAllCategories(arr){
    var retArr = [];
    arr.forEach(function(dataRow){
        if(retArr.indexOf(dataRow.Category) === -1){
            retArr.push(dataRow.Category);
        }
    });
    return retArr;
}
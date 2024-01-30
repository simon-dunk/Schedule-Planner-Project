const dataObj = {
    rowOne: {
        title: null,
        day: [],
        time : {
            start : null,
            end : null
        },
        location: null,
    },
    rowTwo: {
        title: null,
        day: [],
        time : {
            start : null,
            end : null
        },
        location: null,
    },
    rowThree: {
        title: null,
        day: [],
        time : {
            start : null,
            end : null
        },
        location: null,
    },
    rowFour: {
        title: null,
        day: [],
        time : {
            start : null,
            end : null
        },
        location: null,
    },
    rowFive: {
        title: null,
        day: [],
        time : {
            start : null,
            end : null
        },
        location: null,
    }
};

const table = document.getElementById("editableTable");
const weekTable = document.getElementById("WeekDays");
let globalIndex = 0;

function styleTables() {
    // Assuming you want the cell index of the second row (index 1) and third cell (index 2)
    const numberOfCells = table.rows[0].cells.length;
    const numberOfRowsInTable = table.rows.length;
    const numberOfRowsInWeekTable = weekTable.rows.length;
    console.log(`The number of rows is ${numberOfRowsInTable}`);
    console.log(`The number of cells is ${numberOfCells}`);


    for (let i = 0; i < numberOfRowsInTable; i++) {
        console.log(i);
        if (((i + 1) % 2) > 0) {
            // console.log("parsed table index: " + i)
            table.rows[i].style.backgroundColor = "rgb(230, 230, 230)";
        } else {
            table.rows[i].style.backgroundColor = "white";
        }
    }

    for (let i = 0; i < numberOfRowsInWeekTable; i++) {
        weekTable.rows[i].style.backgroundColor = "white";
    }
}

function parseData(input, id, selectedRow) {
    console.log(`> '${input}' was passed to parse`);
    console.log(`> ID is: '${id}'`);
    console.log(`> Selected row '${selectedRow}'`);


    // Weeds & Sorts data to relevant catagories
    if (id === "title") {
        dataObj[selectedRow].title = input;

    } else if (id === "days") {
        let inputListOfDays = input.toLowerCase();
        inputListOfDays = inputListOfDays.replaceAll(' ', '');
        inputListOfDays = inputListOfDays.split(",");
        console.log(inputListOfDays);

        dataObj[selectedRow].day = [];
        for (let item of inputListOfDays) {
            if (item === "mon") {
                dataObj[selectedRow].day.push(0);
            } else if (item === "tue") {
                dataObj[selectedRow].day.push(1);
            } else if (item === "wed") {
                dataObj[selectedRow].day.push(2);
            } else if (item === "thur") {
                dataObj[selectedRow].day.push(3);
            } else if (item === "fri") {
                dataObj[selectedRow].day.push(4);
            }
        }
        

    } else if (id === "time") {
        if (isValidTimeFormat(input)) {
            // gets start and end times into variables
            const times = parseTimeRange(input);
            const start = times.start;
            const end = times.end;
    
            console.log(`Valid Time Range: Start: '${start}', End: '${end}'`);
            dataObj[selectedRow].time.start = start;
            dataObj[selectedRow].time.end = end;
        } else {
            console.log("Invalid Time Range");
        }

    } else if (id === "location") {
        dataObj[selectedRow].location = input;
    }

    console.log();
    console.log();
    console.log(dataObj);

    visualizeDataOnScheduleTables(selectedRow);
}

function isValidTimeFormat(input) {
    // sets patters for time of day format hh:mm and ranges of times
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const timeRangePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    // const trimmedInput = input.trim();
    const trimmedInput = input.replace(/[^0-9:-]/g, '');

    if (timeRangePattern.test(trimmedInput)) {
        const times = trimmedInput.split('-').map(time => time.trim());
        if (timePattern.test(times[0]) && timePattern.test(times[1])) {
            return true;
        }
    }
    return false;
}

function parseTimeRange(input) {
    const trimmedInput = input.replace(/[^0-9:-]/g, '');
    const times = trimmedInput.split('-').map(time => time.trim());
    return {
        start: times[0],
        end: times[1]
    };
}


function visualizeDataOnScheduleTables(selectedRow) {
    console.log(dataObj[selectedRow]);

    if (checkForAnyNullValue(selectedRow)) {
        const divPixelHeight = calculateTotalMinutes(selectedRow);
        const startingHourAndMinute = dataObj[selectedRow].time.start.split(":");
        let tableDivLocation; // Uses the start time to determine which td use
        let divSubLocation; // determine if the start time is not an even hour

        if (startingHourAndMinute[1] == "00") {
            tableDivLocation = startingHourAndMinute[0];
            console.log(`Div location will be (${tableDivLocation})`);
        } else {
            tableDivLocation = startingHourAndMinute[0]
            divSubLocation = startingHourAndMinute[1];
            console.log(`Div location will be (${tableDivLocation}.${divSubLocation})`);
        }

        // sets access for all elements of the correct table row
        const tableRowOfHour = document.getElementById(tableDivLocation);
        for (let idx of dataObj[selectedRow].day) {
            let currDiv = tableRowOfHour.getElementsByTagName("div")[idx + 1];

            currDiv.innerHTML = `<p>
            ${dataObj[selectedRow].title}
            <br>
            ${dataObj[selectedRow].location}
            <br>
            ${dataObj[selectedRow].time.start}-${dataObj[selectedRow].time.end}
            </p>`;


            currDiv.classList.add("classBubble");
            if (currDiv) {
                currDiv.style.marginTop = `${divSubLocation}px`;
            }
            currDiv.style.height = `${divPixelHeight}px`;

        }     
    }
}

function checkForAnyNullValue(selectedRow) {
    const rowToCheck = dataObj[selectedRow];
    const isDaysEmpty = rowToCheck.day.length === 0;
    console.log("Expected error");
    const areTimesNull = rowToCheck.time.start === null && rowToCheck.time.end === null;
    const isTitleEmpty = rowToCheck.title === null || rowToCheck.title.trim() === "";
    const isLocationEmpty = rowToCheck.location === null || rowToCheck.location.trim() === "";

    let allDataHasValues = false;

    // Checks for any null values
    if (isDaysEmpty && areTimesNull && isTitleEmpty && isLocationEmpty) {
        console.log(`${rowToCheck} has an empty "days" list, both "start" and "end" times are null, "title" is empty, and "location" is empty.`);
    } else {
        if (isDaysEmpty) {
            console.log(`${rowToCheck} has an empty "days" list.`);
        }
        if (areTimesNull) {
            console.log(`${rowToCheck} has both "start" and "end" times as null.`);
        }
        if (isTitleEmpty) {
            console.log(`${rowToCheck} has an empty "title".`);
        }
        if (isLocationEmpty) {
            console.log(`${rowToCheck} has an empty "location".`);
        }
    }
    if (!isDaysEmpty && !areTimesNull && !isTitleEmpty && !isLocationEmpty) {
        allDataHasValues = true;
        console.log(`${allDataHasValues}`);

        return allDataHasValues;

    } else {
        console.log(`${allDataHasValues}`);

        return allDataHasValues;
    }    
}


function timeToMinutes(time) {
    const [hour, minute] = time.split(':').map(Number);
    let totalMinutes = hour * 60 + minute;
    return totalMinutes;
}

function calculateTotalMinutes(selectedRow) {
    const start = dataObj[selectedRow].time.start;
    const end = dataObj[selectedRow].time.end;
    let minuteRange = timeToMinutes(end) - timeToMinutes(start);
    /* Assume that if end time is earlier than start time, 
    then end time is PM and start time is AM */
    if (minuteRange < 0) {
        minuteRange += 12 * 60;
    }

    console.log(`Range is: '${minuteRange}' minutes`);
    return minuteRange;
}

function formatTimeRange(inputString) {
    const timeParts = inputString.split('-');

    function formatTimePart(timePart) {
        const [time, period] = timePart.trim().split(' ');
        const [hours, minutes] = time.split(':');
        const formattedHours = parseInt(hours, 10).toString(); // Remove leading zeros from hours
        return `${formattedHours}:${minutes}`;
    }

    // Format both time parts and join them with " - "
    const formattedTimeRange = timeParts.map(formatTimePart).join(' - ');

    return formattedTimeRange;
}

// EVENT LISTENER(s)


table.addEventListener('input', function (event) {
    const target = event.target;
    // const selection = window.getSelection();
    const output = target.textContent;
    const outputID = target.id;
    const targetParentNode = target.parentNode;
    const targetGrandparentNode = targetParentNode.parentNode;
    const targetGrandparentNodeId = targetGrandparentNode.getAttribute('id');

    console.log(`Row '${targetGrandparentNodeId}' selected `);
    console.log(`Cell contains '${target.textContent}'`);
    // console.log("ID: " + outputID);

    if (outputID) {
        parseData(output, outputID, targetGrandparentNodeId);
    }
});

table.addEventListener('paste', (event) => {
    const target = event.target;

    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    const modifiedString = pastedText.replace(/\n/g, '\t');
    const values = modifiedString.split('\t');
    const cells = table.querySelectorAll('div');

    console.log(pastedText);
    console.log(modifiedString);
    console.log(values);

    // Assign the pasted values to the corresponding cells
    for (let i = 0; i < cells.length && i < values.length; i++) {
        ++globalIndex;
        const cell = cells[globalIndex];
        cell.innerHTML = values[i];

    }

    // calls the parseData function for each individual cell when pasted in
    for (let i = 0; i < globalIndex; i++) {
        let cell = cells[i + 1];

        let output = cell.textContent;
        let outputID = cell.id;
        let targetParentNode = cell.parentNode;
        let targetGrandparentNode = targetParentNode.parentNode;
        let targetGrandparentNodeId = targetGrandparentNode.getAttribute('id');

        console.log(`Row '${targetGrandparentNodeId}' selected `);
        console.log(`Cell contains '${cell.textContent}'`);

        if (outputID) {
            parseData(output, outputID, targetGrandparentNodeId);
        }
    }

    const output = target.textContent;
    const outputID = target.id;
    const targetParentNode = target.parentNode;
    const targetGrandparentNode = targetParentNode.parentNode;
    const targetGrandparentNodeId = targetGrandparentNode.getAttribute('id');

    console.log(`Row '${targetGrandparentNodeId}' selected `);
    console.log(`Cell contains '${target.textContent}'`);

    if (outputID) {
        parseData(output, outputID, targetGrandparentNodeId);
    }
});

// const convert = document.getElementById("convertBannerData");
// let mouseOver;
// convert.addEventListener('mouseover', function (event) {
//     let mouseOver = true;
// });
// convert.addEventListener('mouseout', function (event) {
//     let mouseOver = true;
// });
// convert.addEventListener('paste', function (event) {
//     const target = event.target;
//     event.preventDefault();
//     const pastedText = (event.clipboardData || window.clipboardData).getData('text');
//     const modifiedString = pastedText.replace(/\n/g, '\t');
//     const values = modifiedString.split('\t');
//     const wantedIndexOfPastedData = [1, 2, 7, 8, 9, 19, 21];

//     const crn = values[1];
//     const course = `${values[2]}-${values[3]}`;
//     let title = values[7];
//     if (title.length > 11) {
//         let words = title.split(" ");
//         title = "";
//         for (let word of words) {
//             title += word[0];
//             title += word[1];
//             title += word[2];
//         }
//     }

//     const time = formatTimeRange(values[9]);
//     const prof = values[19].split(" ")[2];
//     const location = values[21];
//     let days = "";

//     if (values[8].includes("M")) {
//         days += "Mon";
//     } 
//     if (values[8].includes("T")) {
//         days += "Tue";
//     } 
//     if (values[8].includes("W")) {
//         days += ", Wed";
//     } 
//     if (values[8].includes("R")) {
//         days += ", Thur";
//     } 
//     if (values[8].includes("F")) {
//         days += ", Fri";
//     }


//     const cells = table.querySelectorAll('div');
//     ++globalIndex
//     cells[globalIndex].innerHTML = crn;
//     ++globalIndex
//     cells[globalIndex].innerHTML = course;
//     ++globalIndex
//     cells[globalIndex].innerHTML = title;
//     ++globalIndex
//     cells[globalIndex].innerHTML = prof;
//     ++globalIndex
//     cells[globalIndex].innerHTML = days;
//     ++globalIndex
//     cells[globalIndex].innerHTML = time;
//     ++globalIndex
//     cells[globalIndex].innerHTML = location;

//     // calls the parseData function for each individual cell when pasted in
//     for (let i = 0; i < globalIndex; i++) {
//         let cell = cells[i + 1];

//         let output = cell.textContent;
//         let outputID = cell.id;
//         let targetParentNode = cell.parentNode;
//         let targetGrandparentNode = targetParentNode.parentNode;
//         let targetGrandparentNodeId = targetGrandparentNode.getAttribute('id');

//         console.log(`Row '${targetGrandparentNodeId}' selected `);
//         console.log(`Cell contains '${cell.textContent}'`);

//         if (outputID) {
//             parseData(output, outputID, targetGrandparentNodeId);
//         }
//     }

//     const output = target.textContent;
//     const outputID = target.id;
//     const targetParentNode = target.parentNode;
//     const targetGrandparentNode = targetParentNode.parentNode;
//     const targetGrandparentNodeId = targetGrandparentNode.getAttribute('id');

//     console.log(`Row '${targetGrandparentNodeId}' selected `);
//     console.log(`Cell contains '${target.textContent}'`);

//     if (outputID) {
//         parseData(output, outputID, targetGrandparentNodeId);
//     }

// });


styleTables(table);
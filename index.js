const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:");

db.serialize(function(){
    //1.Create an in memory database with a ‘Classroom’ and ‘Department’ table containing the above relations.
    db.run("CREATE TABLE Classroom (Building TEXT, Room_number NUMBER, Capacity NUMBER)");
    db.run("CREATE TABLE Department (Dept_name TEXT, Building TEXT, Budget NUMBER)");

    db.run("INSERT INTO Classroom VALUES('Packard', 101, 500)");
    db.run("INSERT INTO Classroom VALUES('Painter', 514, 10)");
    db.run("INSERT INTO Classroom VALUES('Tylor', 3128, 70)");
    db.run("INSERT INTO Classroom VALUES('Watson', 100, 30)");
    db.run("INSERT INTO Classroom VALUES('Watson', 120, 50)");

    db.run("INSERT INTO Department VALUES('Biology', 'Watson',90000)");
    db.run("INSERT INTO Department VALUES('Comp. Sci.', 'Taylor',100000)");
    db.run("INSERT INTO Department VALUES('Elec. Eng.', 'Taylor',85000)");
    db.run("INSERT INTO Department VALUES('Finance', 'Painter',120000)");
    db.run("INSERT INTO Department VALUES('History', 'Painter',50000)");
    db.run("INSERT INTO Department VALUES('Music', 'Packard',80000)");
    db.run("INSERT INTO Department VALUES('Physics', 'Watson',70000)");

    //2.Print the room number and building name for those rooms whose capacity is greater than 50.
    console.log("Following are Room No. & Building name whose capacity is greater than 50:");
    db.each("SELECT Room_number, Building FROM Classroom WHERE Capacity>50",
    function(err,row){
                console.log("Romm No."+row.Room_number +' in '+ row.Building +' building')
        }); 

    //3.Print the names of those departments whose budgets are greater than $85,000.
    let Departments =new Array();
    db.each(
        "SELECT Dept_name FROM Department WHERE Budget>85000",
        function(err,row){
                Departments.push(row.Dept_name)
        },
        function(err,count){
                let resString = "";
                for(let i = 0; i != Departments.length; i++){
                        if (i != count - 1) {
                                resString += Departments[i] + ", "
                        }
                        else
                        resString += Departments[i];
                }
                console.log('Departments with budget greater than 85000 => '+resString);
        }
    );

    //4.For each department, print the total capacity available
        let results =new Array();
        db.each(
                "SELECT Department.Dept_name as Dept_name,sum(Classroom.Capacity) as Capacity FROM Department,Classroom WHERE Department.Building like Classroom.Building GROUP BY Department.Dept_name",
                function(err,row){
                        results.push(row.Dept_name,': '+row.Capacity+'      ')
                },
                function(err,count){
                        let resultString = "";
                        for(let i = 0; i != results.length; i++){
                        if (i != count - 1) {
                                resultString += results[i]
                        }
                        else
                                resultString += results[i]
        
                        }
                console.log('Departments and its capacity => '+ resultString);
                }
        );

/* ****OUTPUT***
Following are Room No. & Building name whose capacity is greater than 50:
Romm No.101 in Packard building
Romm No.3128 in Tylor building
Departments with budget greater than 85000 => Biology, Comp. Sci., Finance
Departments and its capacity => Biology: 80      Finance: 10      History: 10      Music: 500      Physics: 80
****OUTPUT*** */

});
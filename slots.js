const axios = require('axios').default; //axios used to make http rest calls(get, post etc)
const Table = require('tty-table'); //tty table used to beautify tables for output
const chalk = require('chalk'); //chalk used to beautify text in general (bgcolour, text colout etc)
const notifier = require('node-notifier'); //node notifier used to send notifications to user

var inquirer = require('inquirer'); //inquirer used to give user choices, select options etc

const { config, options } = require('./config');


module.exports = function (districtid) {
  var date = new Date();
  var todaysDate = `${date.getDate()}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  inquirer
    .prompt([{
      type: "list",
      name: "choice",
      message: "Please choose age group",
      choices: [
        {
          name: "All ages",
          value: ""
        },
        {
          name: "45+",
          value: "45"
        },
        {
          name: "18-45",
          value: "18"
        }
      ]
    }
    ])
    .then((answers) => {

      axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtid}&date=${todaysDate}`, config) //make api call to access slots by district id and date
        .then(function (response) {

          let header = [{
            value: "center",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Center name",
            width: 80
          },
          {
            value: "address",
            headerColor: "cyan",
            color: "red",
            alias: "Center address",
            width: 40
          },
          {
            value: "available",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Available slots",
            width: 40
          },
          {
            value: "min_age",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Minimum Age",
            width: 40
          },
          {
            value: "date",
            headerColor: "cyan",
            color: "white",
            align: "left",
            alias: "Date",
            width: 30
          }]
          
          var finalData = [];
          var districtName;
          response.data.centers.forEach((item) => { //item is iterated to access elements like district name, address etc
            districtName = item.district_name;
            item.sessions.forEach((session) => {  //session is iterated to access elements like district available slots, age etc
              if (answers.choice == "") {  //to check what option selected by user based on age
                let ourData = {
                  center: item.name,
                  address: item.address,
                  available: session.available_capacity,
                  min_age: session.min_age_limit,
                  date: session.date
                };
                finalData.push(ourData);
              }
              else if (answers.choice == session.min_age_limit) {
                let ourData = {
                  center: item.name, 
                  address: item.address,
                  available: session.available_capacity,
                  min_age: session.min_age_limit,
                  date: session.date
                };
                finalData.push(ourData); //pushes individual lists of data for each slot(name, address, age etc )into array finalData[]
              }
            })
          });
          const out = Table(header, finalData, options).render(); //makes table and stores in variable out
          console.log(chalk.blue.bgRed.bold(`Date for which this is run ->${todaysDate}`)) //prints date
          console.log(chalk.blue.bgRed.bold(`District for which this is run ->${districtName}`))  //prints district name
          console.log(out); //prints table 
          notifier.notify({
            title:"Cowin slots executed",
            subtitle:"subtitle",
            message:"Available slots mentioned!",
            wait:"true"
          })
        })

        .catch(function (error) {
          // handle error
          console.log(error);
        })
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });

}

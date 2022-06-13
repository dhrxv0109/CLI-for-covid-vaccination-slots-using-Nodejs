const axios = require('axios').default;
const Table=require('tty-table');
const {config,options}= require('./config');
module.exports=function(){
// Make a request for states API
axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states',config)
  .then(function (response) {
    // handle success
    //console.table(response.data.states);
    let header = [{
      value: "state_id",
      headerColor: "cyan",
      color: "white",
      align: "left",
      width: 20
    },
    {
      value: "state_name",
      headerColor: "cyan",
      color: "red",
      width: 40
      
    }]
    const out = Table(header,response.data.states,options).render()
    console.log(out); //prints output
  })

  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

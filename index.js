#! /usr/bin/env node
const states= require("../util/states");
const districts= require("../util/districts");
const slots= require("../util/slots");
const program= require("commander");


program
  .command('states')
  .description('List down all the states')
  .action(states);

program
 .command('districts <stateid>')
 .description('List down all the districts for a state using state_id')
 .action(districts);

program
 .command('slots <districtid>')
 .description('List all slots in a district using district_id')
 .action(slots);

program.parse();




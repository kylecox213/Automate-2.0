import axios from "axios";

export default {

  // All commented-out routes are routes not currently in use
  // But may be in use later with app updates

  // -------------------------------------- //
  // AUTH ROUTES
  // -------------------------------------- //

  // GET to check if a user is currently logged in
  userLoginCheck: function()  {
    return axios.get ("/auth/user");
  },
  // POST to log User into the application
  userLogin: function (userData) {
    return axios.post("/auth/user/login", userData);
  },
  // GET to log User out of the application
  userLogout: function () {
    return axios.post("/auth/user/logout");
  },



  // -------------------------------------- //
  // USER ROUTES
  // -------------------------------------- //

  // // GET all Users
  // getUsers: function () {
  //   return axios.get("/api/users");
  // },
  // GET one User with the given id
  getThisUser: function (id) {
    return axios.get("/api/users/" + id);
  },
  // POST to add a new User to the database
  addNewUser: function (userData) {
    return axios.post("/api/users/register", userData)
  },
  // UPDATE a User with the given id
  updateThisUser: function (id, UserData) {
    return axios.put("/api/users/" + id, UserData)
  },
  // DELETE (destroy) a User with the given id
  deleteThisUser: function (id) {
    return axios.delete("api/users/" + id);
  },
  // // GET all Transactions for the User with the given id
  // getUserTransactions: function (id) {
  //   return axios.get("/api/users/" + id + "/transactions");
  // },
  // // GET all Reports for the User with the given id
  // getUserReports: function (id) {
  //   return axios.get("/api/users/" + id + "/reports");
  // },



  // -------------------------------------- //
  // CUSTOMER ROUTES
  // -------------------------------------- //

  // // GET all Customers
  // getCustomers: function () {
  //   return axios.get("/api/customers");
  // },
  // GET one Customer with the given id
  getCustomerById: function (id) {
    return axios.get("/api/customers/" + id);
  },
  // GET to find ONE Customer with the given params
  getCustomerByParams: function (firstName, lastName, phone) {
    return axios.get(`/api/customers/find/q?firstName=${firstName}&lastName=${lastName}&phone=${phone}`);
  },
  // GET to find MULTIPLE Customers with the given params
  getCustomersByParams: function (params) {
    let queryString = "q?";
    console.log(Object.keys(params));
    Object.keys(params).map(key => {
      let value = params[key];
      return queryString += `${key}=${value}&`
    });
    console.log(queryString);
    return axios.get(`/api/customers/findMultiple/${queryString}`);
  },
  // ADD a new Customer to the database
  addNewCustomer: function (CustomerData) {
    return axios.post("/api/customers", CustomerData)
  },
  // POST to add a new Customer to the database with an associated Vehicle
  addNewCustomerWithVehicle: function (customerData, vehicleData) {
    let data = {
      customerData: customerData,
      vehicleData: vehicleData
    };
    return axios.post("/api/customers/addNewWithVehicle", data);
  },
  // UPDATE a Customer with the given id
  updateThisCustomer: function (id, CustomerData) {
    return axios.put("/api/customers/" + id, CustomerData)
  },
  // // DELETE (destroy in Sequelize) a Customer with the given id
  // deleteThisCustomer: function (id) {
  //   return axios.delete("api/customers/" + id);
  // },





  // -------------------------------------- //
  // VEHICLE ROUTES
  // -------------------------------------- //

  // // GET all Vehicles
  // getVehicles: function () {
  //   return axios.get("/api/vehicles");
  // },
  // GET one Vehicle with the given id
  getThisVehicle: function (id) {
    return axios.get("/api/vehicles/" + id);
  },
  getVehicleByParams: function (customerId) {
    return axios.get(`/api/vehicles/find/q?CustomerId=${customerId}`);
  },
  // ADD a new Vehicle to the database
  addNewVehicle: function (VehicleData) {
    return axios.post("/api/vehicles", VehicleData)
  },
  // UPDATE a Vehicle with the given id
  updateThisVehicle: function (id, VehicleData) {
    return axios.put("/api/vehicles/" + id, VehicleData)
  },
  // // DELETE (destroy in Sequelize) a Vehicle with the given id
  // deleteThisVehicle: function (id) {
  //   return axios.delete("api/vehicles/" + id);
  // },
  acquireVehiclesByParams: function (params) {
    let queryString = "q?";
    console.log(Object.keys(params));
    Object.keys(params).map(key => {
      let value = params[key];
      return queryString += `${key}=${value}&`
    });
    console.log(queryString);
    return axios.get(`/api/vehicles/findMultiple/${queryString}`);
  },



  // -------------------------------------- //
  // TRANSACTION ROUTES
  // -------------------------------------- //

  // // GET all Transactions
  // getTransactions: function () {
  //   return axios.get("/api/transactions");
  // },
  // GET one Transaction with the given id
  getThisTransaction: function (id) {
    return axios.get("/api/transactions/" + id);
  },
  // ADD a new Transaction to the database
  addNewTransaction: function (TransactionData) {
    return axios.post("/api/transactions", TransactionData)
  },
  // UPDATE a Transaction with the given id
  updateThisTransaction: function (id, TransactionData) {
    return axios.put("/api/transactions/" + id, TransactionData)
  },
  // DELETE (destroy in Sequelize) a Transaction with the given id
  deleteThisTransaction: function (id) {
    return axios.delete("api/transactions/" + id);
  },
  getTransactionsByParams: function (params) {
    let queryString = "q?";
    console.log(Object.keys(params));
    Object.keys(params).map(key => {
      let value = params[key];
      return queryString += `${key}=${value}&`
    });
    console.log(queryString);
    return axios.get(`/api/transactions/findMultiple/${queryString}`);
  },



  // -------------------------------------- //
  // REPORT ROUTES
  // -------------------------------------- //

  // // GET all Reports
  // getReports: function () {
  //   return axios.get("/api/reports");
  // },
  // // GET one Report with the given id
  // getThisReport: function (id) {
  //   return axios.get("/api/reports/" + id);
  // },
  // // ADD a new Report to the database
  // addNewReport: function (report) {
  //   return axios.post("/api/reports", report)
  // },
  // // DELETE (destroy in Sequelize) a Report with the given id
  // deleteThisReport: function (id) {
  //   return axios.delete("api/reports/" + id);
  // }
};

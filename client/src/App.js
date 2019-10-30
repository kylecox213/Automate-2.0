import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { PrivateRoute, PublicRoute } from "./components/SpecialRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import Customer from "./pages/Customer";
import Vehicle from "./pages/Vehicle";
import Transaction from "./pages/Transaction";
import AddTransaction from "./pages/AddTransaction";
import TransactionList from "./pages/TransactionList";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Report from "./pages/Report";
import Nav from "./components/Nav";
import API from "./utils/API";

const requireLogin = (nextState, replace, cb) => {
  const data = API.userLoginCheck(response => { return response.data }); // check login in your state
  console.log(data);
  if (!data.user === false) {
    replace("/"); // make user to redirect to some route based on your requirement
  }
  cb(); //if user present in it fallback to here
};

class App extends React.Component {



  render() {

    return (

      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route onEnter={requireLogin} >
              <Route path="/app"
                render={({ match: { path } }) => (
                  <>
                    <Route path={`${path}`} component={Homepage} exact />
                    <Route path={`${path}/customer`} component={Customer} />
                    <Route path={`${path}/vehicle`} component={Vehicle} />
                    <Route path={`${path}/transaction`} component={Transaction} />
                    <Route path={`${path}/addtransaction`} component={AddTransaction} />
                    <Route path={`${path}/history/customer`} component={TransactionList} />
                    <Route path={`${path}/browse`} component={Browse} />
                    <Route path={`${path}/search`} component={Search} />
                    <Route path={`${path}/report`} component={Report} />
                  </>
                )
                }
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}



export default App;

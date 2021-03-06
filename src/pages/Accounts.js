import CustomTable from "components/Table";
import React, { Component, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { IoCaretBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { API } from "aws-amplify";
import * as queries from "../graphql/queries";
import { numberWithCommas } from "core/helper";
import { books } from "../constants";

const Accounts = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);

  const currentProjectId = useSelector(
    // @ts-ignore
    (state) => state.userState.currentProject
  );

  const loadAccounts = async () => {
    const {
      data: {
        getAccount: {
          AccountTransactions: { items },
        },
      },
    } = await API.graphql({
      query: queries.getAccountTransactions,
      variables: { id: props.location.state.sales.id },
    });
    setData(items);
    console.log(items);
  };

  useEffect(() => {
    console.log(props.location.state);
    loadAccounts();
  }, [props.location.state]);

  return (
    <div className="py-8 w-full h-full flex align-items-center justify-start flex-column">
      <div className="w-full flex justify-between align-items-center border-b-2 pb-2 border-gray-300">
        <div className="flex align-items-center">
          <IoCaretBack
            onClick={() => history.goBack()}
            className="cursor-pointer mr-2"
            size="24"
          />
          <div className="text-3xl font-semibold">
            {props.location.state.sales.name}
          </div>
        </div>

        <div className="text-3xl font-semibold">
          SGD $
          {(props.location.state.sales.endBalance < 0 ? "(" : "") +
            numberWithCommas(
              Math.abs(props.location.state.sales.endBalance) +
                (props.location.state.sales.endBalance < 0 && ")")
            )}
        </div>
      </div>
      <div className="w-full mt-4">
        {data && (
          <CustomTable
            data={data}
            isCashTable={
              props.location.state.sales.name === "Cash" ||
              props.location.state.sales.name === "Bank"
            }
            isBook={books.includes(props.location.state.sales.name)}
            navigateCallback={(
              id,
              index,
              date,
              amountInGJ,
              amountInInvoice,
              status
            ) =>
              props.history.push({
                pathname:
                  "/Accounts/" +
                  props.location.state.sales.name +
                  "/transaction/" +
                  id,
                state: {
                  index,
                  date,
                  amountInGJ,
                  amountInInvoice,
                  status,
                },
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(Accounts);

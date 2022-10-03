import { useState, useEffect } from 'react'
import "./LiveShopping.css"

const digitecFetchUrl = import.meta.env.VITE_PROXIED_API_URL;

const headersList = {
  "Accept": "*/*",
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
  "Content-Type": "application/json",
  "Origin": "https://www.digitec.ch"
}

const gqlBody = {
  query: `query GET_SOCIAL_SHOPPINGS($take: Int, $latest: String) {
    socialShopping(take: $take, latest: $latest) {
      latestTransactionTimeStamp
      items {
        id
        userName
        cityName
        dateTime
        imageUrl
        brandName
        fullProductName
        salesPrice {
          amountIncl
          amountExcl
          currency
          __typename
        }
        oAuthProviderName
        targetUserName
        quote
        voteTypeId
        productTypeName
        socialShoppingTransactionTypeId
        url
        rating
        searchString
        __typename
      }
      __typename
    }
  }`,
  variables: { "take": 10, "latest": null }
}
const bodyContent = JSON.stringify(gqlBody);

const GQL = {
  CONNECTION_INIT: 'connection_init',
  CONNECTION_ACK: 'connection_ack',
  CONNECTION_ERROR: 'connection_error',
  CONNECTION_KEEP_ALIVE: 'ka',
  START: 'start',
  STOP: 'stop',
  CONNECTION_TERMINATE: 'connection_terminate',
  DATA: 'data',
  ERROR: 'error',
  COMPLETE: 'complete'
}

let payload = {
  variables: {},
  extensions: {},
  operationName: "SUBSCRIBE_SOCIAL_SHOPPINGS",
  query: "subscription SUBSCRIBE_SOCIAL_SHOPPINGS {\n  socialShopping {\n    latestTransactionTimeStamp\n    items {\n      id\n      userName\n      cityName\n      dateTime\n      brandName\n      imageUrl\n      fullProductName\n      salesPrice {\n        amountIncl\n        amountExcl\n        currency\n        __typename\n      }\n      oAuthProviderName\n      targetUserName\n      quote\n      voteTypeId\n      productTypeName\n      socialShoppingTransactionTypeId\n      url\n      rating\n      searchString\n      __typename\n    }\n    __typename\n  }\n}\n"
}

function LiveShopping() {
  let ws_connection = new WebSocket("wss://www.digitec.ch/api/subscriptions", "graphql-ws");
  
  const [products, setProducts] = useState<Object[]>([]);

  useEffect(() => {
    console.log("fetching data from: " + digitecFetchUrl);
    fetch(digitecFetchUrl, {
      method: "POST",
      body: bodyContent,
      headers: headersList
    })
    .then(response => response.json())
    .then(data => setProducts(data.data.socialShopping.items));
  }, []);
  
  
  ws_connection.onopen = function () {
    ws_connection.send(JSON.stringify({ type: GQL.CONNECTION_INIT, payload: { portalId: 25, mandator: 406802, country: "ch", culture: "en-US" }}));
  };

  ws_connection.onmessage = function (event) {
    const data = JSON.parse(event.data)
    switch (data.type) {
      case GQL.CONNECTION_ACK: {
        ws_connection.send(JSON.stringify({
          id: "1",
          type: GQL.START,
          payload
        }))
        break
      }
      case GQL.CONNECTION_ERROR: {
        console.log(data.payload)
        break
      }
      case GQL.DATA: {
        console.log(data.payload.data.socialShopping.items[0]);
        setProducts(prevProducts => [data.payload.data.socialShopping.items[0], ...prevProducts.slice(0, -1)]);
        break
      }
    };
  };

  if (products.length === 0) {
    return <div className="main-container"><div className="card"><div style={{ textAlign: "center"}}>Loading...</div></div></div>;
  }
  return (
    <div className="main-container">
      <div className="card">
      {products.map((item: any) => (
        <div>
          <p><b>{item.userName}</b> bought <b>{item.fullProductName}</b> from <b>{item.brandName}</b></p>
        </div>
      ))}
      </div>
    </div>
  )
}

export default LiveShopping

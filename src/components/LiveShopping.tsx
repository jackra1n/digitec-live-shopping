import { useState, useEffect } from 'react'
import "./LiveShopping.css"

const digitecFetchUrl = import.meta.env.VITE_PROXIED_API_URL;

const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
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

function LiveShopping() {

  const [products, setProducts] = useState([])

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

  if (products.length === 0) {
    return <div>Loading...</div>;
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

import "./App.css";

const MainPage = (props: any) => {
  return (
    <div className="App">
      <h1>digitec Live shopping</h1>
      {props.children}
    </div>
  )
}

export default MainPage

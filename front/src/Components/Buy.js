import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Buy.css";
import "../Styles/text.css";

const Buy = ({ state }) => {
  const handleTransactionError = (error) => {
    toast.error("Transaction failed");
  };

  const buyInspo = async (event) => {
    event.preventDefault();
    const { contract } = state;
    const name = document.querySelector("#name").value;
    const message = document.querySelector("#message").value;

    try {
      // Set the transaction amount
      const amount = { value: ethers.utils.parseEther("0.001") };

      // Attempt to execute the transaction
      const transaction = await contract.buyInspo(name, message, amount);

      // Wait for the transaction to be mined
      await transaction.wait();

      // If the transaction is successful, display success notification
      toast.success("Transaction is successful");

      // Reload the page or update your UI as needed
      window.location.reload();
    } catch (error) {
      // If there's an error, handle it and display an error notification
      handleTransactionError(error);
    }
  };

  return (
    <div
      className="form-content"
      style={{
        padding: "1em 10em 2em",
        height: "auto",
        width: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        background: "linear-gradient(to right, #ECF2FF, #FBFCFF)",
      }}
    >
      <h1
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Write something inspiring:
      </h1>
      <form onSubmit={buyInspo}>
        <div
          className="inputbox"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Name</span>
          <input
            type="text"
            required="required"
            id="name"
            style={{
              width: "100%",
              margin: "8px 0",
              padding: "0 12px",
              display: "block",
              height: "40px",
              color: "black",
              border: "1px solid transparent",
              borderRadius: "6px",
              backgroundColor: "#c9def4",
              outline: "transparent",
              fontFamily: "'Rubik', sans-serif",
              fontSize: "18px",
              letterSpacing: ".7px",
            }}
          />
        </div>
        <div className="inputbox">
          {" "}
          <span>Message</span>
          <input
            type="text"
            required="required"
            id="message"
            style={{
              width: "100%",
              margin: "8px 0",
              padding: "0 12px",
              display: "block",
              height: "40px",
              color: "black",
              border: "1px solid transparent",
              borderRadius: "6px",
              backgroundColor: "#c9def4",
              outline: "transparent",
              fontFamily: "'Rubik', sans-serif",
              fontSize: "18px",
              letterSpacing: ".7px",
            }}
          />
        </div>
        <div className="inputbox" style={{ marginTop: 30 }}>
          <input
            type="submit"
            value="Pay"
            disabled={!state.contract}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#dd5030",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "18px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "lighter",
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default Buy;

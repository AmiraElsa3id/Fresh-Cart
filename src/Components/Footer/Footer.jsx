import styles from "./Footer.module.css";
import amazon_pay from "../../assets/imgs/footer/2560px-Amazon_Pay_logo.svg.png";
import american_express from "../../assets/imgs/footer/American-Express-Logo-PNG-File.png";
import master_card from "../../assets/imgs/footer/purepng.com-mastercard-logologobrand-logoiconslogos-251519938372dnf77.png";
import paypal from "../../assets/imgs/footer/PayPal.svg.png";
import downloadAppStore from "../../assets/imgs/footer/th1.png";
import downloadGooglePlay from "../../assets/imgs/footer/th2.png";


function Footer() {
  return (
    <footer className='bg-[#F0F3F2] py-16 mt-10'>
      <section className="w-[80%] mx-auto px-3 bg-[#F0F3F2]">
        <h2 className="font-medium leading-5 mb-3 mt-0 text-3xl">Get the FreshCart app</h2>
        <p className=" mb-3">We'll send you a link, open it on your phone to download the app.</p>
        <form className="flex flex-wrap md:flex-nowrap my-3 w-full"><div className=" w-full md:w-4/5 pe-2">

          <input type="email" placeholder="Email" aria-label="Email" className=" form-control" />
        </div>
        <div className="w-full md:w-1/5 pe-2 pt-2 md:pt-0">
          <button className="btn">Share App</button>
        </div>
        </form>
        <hr className="bg-[#9e9e9e] text-[#9e9e9e] font-medium" />
        <div className="links flex gap-5  justify-between flex-wrap">
          <div className="partners flex gap-3 items-center">
            <h5>Payment Partners:</h5>
            <ul className="list-unstyled flex gap-1 md:gap-3 items-center flex-wrap">
              <li>
                <img src={amazon_pay} alt="Amazon Pay" width="70px" />
              </li>
              <li>
                <img src={american_express} alt="American Express" width="70px" />
              </li>
              <li>
                <img src={master_card} alt="Master Card" width="70px" />
              </li>
              <li>
                <img src={paypal} alt="PayPal" width="70px" />
              </li>
            </ul>
          </div>
          <div className="download flex md:gap-1 items-center gap-3 flex-wrap">
            <h5>Get Deliveries with FreshCart</h5>
            <div className="flex">
              <img src={downloadAppStore} alt="Download" style={{ width: "50%", maxWidth: "12rem" }} />
              <img src={downloadGooglePlay} alt="Download" style={{ width: "50%", maxWidth: "12rem" }} />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
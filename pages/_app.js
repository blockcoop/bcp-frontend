import "../styles/custom.scss";
import { wrapper } from "../redux/store";
import Head from "next/head";
import Header from "../components/Header";
import TransactionModal from "../components/TransactionModal";
import ChangeNetworkModal from "../components/ChangeNetworkModal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>BlockCOOP</title>
                <meta
                    name="description"
                    content="Create you COOP on Blockchain"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <TransactionModal />
            <ChangeNetworkModal />
            <ToastContainer />
            <Component {...pageProps} />
            <Footer />
        </>
    );
}

export default wrapper.withRedux(MyApp);

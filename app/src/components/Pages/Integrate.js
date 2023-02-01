import React from "react";

import ViewLocationContractDetails from "./ViewLocationContractDetails";


import 'react-toastify/dist/ReactToastify.css';



const Integrate = () => {
    return (
        <div className="container">
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper" style={{ backgroundColor: "white" }}>
                {/* Main content */}
                <section className="content" style={{ backgroundColor: "white", marginTop: 20 }}>
                    <div className="container-fluid">
                            <ViewLocationContractDetails/>
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            {/* /.content-wrapper */}
            {/* <Sample lat={_latitude} lng={_longitude} /> */}
            {/* Control Sidebar */}
            <aside className="control-sidebar control-sidebar-dark">
                {/* Control sidebar content goes here */}
            </aside>
            {/* /.control-sidebar */}
        </div>
    );
}

export default Integrate;
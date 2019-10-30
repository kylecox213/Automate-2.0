import React from "react";
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


class LoadingMsg extends React.Component {

    state = {
        loading: true,
    }

    render() {
        return (
            <div>
                <h1 style={{ textAlign: "center", margin:"20px auto" }}>Loading...</h1>
                <div className="loading">
                    <FadeLoader
                        css={override}
                        sizeUnit={"px"}
                        size={150}
                        color={"#231748"}
                        loading={this.state.loading}
                    />
                </div>
            </div>
        )
    }

}

export default LoadingMsg;
import AlertConfirm from "./AlertConfirm";
import AlertDismissable from "./AlertDismissable";
import { useContext } from "react";
import AlertContext from "../helpers/AlertContext";

function AlertContainer() {
    const [alertState, setAlertState] = useContext(AlertContext);
    const Hide = (id) => {
        setAlertState(prev => {
            const start = (Array)(prev).slice(0, id - 1);
            const end = (Array)(prev).slice(id + 1);

            return [...start, ...end];
        });
    };

    return (
        <>
            {alertState && alertState.lenght > 0 &&
                (<div className="alert-container d-flex"
                    style={{ flexDirection: 'column-reverse' }}>
                    {alertState.map((item, index) => (
                        <AlertDismissable hide={() => Hide(index)}
                            heading={item.heading}
                            content={item.content}
                            type={item.type} />
                    ))}
                </div>)}
        </>
    )
}
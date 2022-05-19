import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { connect } from "react-redux";
import CreateTask from "./CreateTask";

const Tasks = (props) => {
    const [tasks, setTasks] = useState(null)
    return <div>
        {
            tasks ?
            <></> :
            <>
                <h4 className="fw-bold mb-3">Tasks <CreateTask /></h4>
            </>
        }
        
    </div>
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Tasks);
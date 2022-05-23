import { useEffect, useState } from "react";
import { Badge, ListGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../redux/services/coop.service";
import CreateTask from "./CreateTask";
import Task from "./Task";

const Tasks = (props) => {
    const [taskCount, setTaskCount] = useState(null)

    const loadTasks = async () => {
        coopService.getTaskCount(props.coop.address).then(count => {
            setTaskCount(Number(count))
        })
    }

    useEffect(() => {
        if(props.coop.address) {
            loadTasks()
        }
    }, [props.coop.address])

    return <div>
        {
            (taskCount !== null)  ?
            <>
                <h4 className="fw-bold mb-3">Tasks <Badge pill bg="secondary">{taskCount}</Badge> {" "}<CreateTask coop={props.coop} loadTasks={loadTasks} /></h4>
                {
                    taskCount > 0 ?
                    <ListGroup>
                        { Array.from(Array((taskCount+1)).keys()).slice(1).map(value => <Task key={value} coopAddress={props.coop.address} taskId={value} />) }
                    </ListGroup> :
                    <h5>No Tasks</h5>
                }
                
            </> :
            <>
                <h4 className="fw-bold mb-3">Tasks</h4>
                Loading <Spinner animation="border" size="sm" />
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
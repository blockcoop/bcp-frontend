import { useCallback, useEffect, useState } from "react"
import { Badge, ListGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import tasksService from "../../redux/services/tasks.service";
import Task from "./Task";
import CreateTask from "./CreateTask";

const Tasks = (props) => {
    const [taskIds, setTaskIds] = useState(null)

    const loadTasks = useCallback( () => {
        tasksService.getCoopTasks(props.coopAddress).then(tasks => {
            setTaskIds(tasks)
        })
    }, [props.coopAddress])

    useEffect(() => {
        loadTasks();
    }, [loadTasks])

    return <div>
        {
            (taskIds !== null)  ?
            <>
                <h4 className="fw-bold mb-3">Tasks <Badge pill bg="secondary">
                    {taskIds.length}</Badge> {" "}
                    <CreateTask coopAddress={props.coopAddress} groupId={props.groupId} loadTasks={loadTasks} />
                </h4>
                {
                    taskIds.length > 0 ?
                    <ListGroup>
                        { taskIds.slice().reverse().map(taskId => <Task key={taskId} taskId={taskId} groupId={props.groupId} groups={props.groups} />) }
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
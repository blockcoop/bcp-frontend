import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Placeholder } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../../redux/services/coop.service";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";

const Groups = (props) => {
    const [groups, setGroups] = useState(null)
    const [groupId, setGroup] = useState(0)

    const loadGroups = useCallback( async () => {
        const grps = await coopService.getGroups(props.coopAddress, true, props.metamask.address);
        setGroups(grps);
        props.setGroups(grps);
        grps.forEach(grp => {
            if(grp.isMember) {
                setGroup(grp.id);
                props.setGroupId(grp.id);
            }
        });
    }, [props.coopAddress, props.metamask.address])

    // const loadGroup = async () => {
    //     const grp = await coopService.getGroups(props.coopAddress, true, props.metamask.address);
    //     setGroups(grps);
    // }

    useEffect(() => {
        loadGroups();
    }, [])

    return (<>
        {
            groups ? <>
                <h4 className="fw-bold mb-3">
                Groups {" "}
                <Badge pill bg="secondary">{groups.length}</Badge>
                {
                    props.coopInitiator == props.metamask.address &&
                    <CreateGroup coopAddress={props.coopAddress} loadGroups={loadGroups} /> 
                }
            </h4>
            <ul className="list-unstyled list-details">
                {
                    groups.map((group, i) => {
                        return (<li key={i}>
                            <span>
                                {group.name} <Badge pill bg="secondary">{group.size}</Badge>
                            </span>
                            {
                                groupId !== 0 ?
                                <>
                                {
                                    groupId == group.id &&
                                    <Badge pill bg="success" style={{paddingTop: '0.4rem'}}>Member</Badge>
                                }
                                </> :
                                <JoinGroup coopAddress={props.coopAddress} coopMembershipFee={props.coopMembershipFee} groupId={group.id} loadGroups={loadGroups} />
                            }
                            
                        </li>)
                    })
                }
                
            </ul>
            </> :
            <>
                <Placeholder className="mb-3" as='h4' animation="glow">
                    <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                    <Placeholder xs={8} />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                    <Placeholder xs={8} />
                </Placeholder>
            </>
        }
        
    </>)
}

function mapStateToProps(state) {
    const { metamask } = state;
    return {
        metamask,
    }
}

export default connect(mapStateToProps)(Groups);
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Placeholder } from "react-bootstrap";
import { connect } from "react-redux";
import coopService from "../../redux/services/coop.service";
import groupsService from "../../redux/services/groups.service";
import AssignModerator from "./AssignModerator";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";

const Groups = (props) => {
    return (<>
        {
            props.groups ? <>
                <h4 className="fw-bold mb-3">
                Groups {" "}
                <Badge pill bg="secondary">{props.groups.length}</Badge>
                {
                    props.coopInitiator == props.metamask.address &&
                    <CreateGroup coopAddress={props.coopAddress} loadGroups={props.loadGroups} /> 
                }
            </h4>
            <ul className="list-unstyled list-details">
                {
                    props.groups.map((group, i) => {
                        return (<li key={i}>
                            <span>
                                {group.name} <Badge pill bg="secondary">{group.members.length}</Badge>
                            </span>
                            {
                                props.coopInitiator == props.metamask.address && group.members.length > group.moderators.length &&
                                <AssignModerator coopAddress={props.coopAddress} group={group} loadGroups={props.loadGroups} />
                            }
                            {
                                group.members.indexOf(props.metamask.address) !== -1 ?
                                <Badge pill bg="success" style={{paddingTop: '0.4rem'}}>Member</Badge> :
                                <>{
                                    props.isCoopMember && <JoinGroup coopAddress={props.coopAddress} groupId={group.id} loadGroups={props.loadGroups} />
                                }</>
                                
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
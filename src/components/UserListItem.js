import React from 'react';
import { TouchableNativeFeedback } from "react-native";
import { ListItem, Left, Right, Text, Icon } from 'native-base';

const userListItem = props => {
    return (
        <TouchableNativeFeedback onPress={props.onItemPressed}>
            <ListItem>
                <Left>
                    <Text>{props.userName}</Text>
                </Left>
                <Right>
                    <Icon name="arrow-forward" />
                </Right>
            </ListItem> 
        </TouchableNativeFeedback>    
    )
}

export default userListItem;
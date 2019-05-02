import React from 'react';
import { TouchableNativeFeedback } from "react-native";
import { ListItem, Left, Text } from 'native-base';

const userListItem = props => {
    return (
        <TouchableNativeFeedback onPress={props.onItemPressed}>
            <ListItem>
                <Left>
                    <Text style={{fontSize: 20}}>{props.userName}</Text>
                </Left>
            </ListItem> 
        </TouchableNativeFeedback>    
    )
}

export default userListItem;
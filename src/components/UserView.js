import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, Icon, ListItem, Left, Right } from 'native-base';

const userView = props => {
    return (
        <Container>
            <ListItem>
                <Left>
                    <Icon name="contact" style={styles.icons}/>
                </Left>
                <Text>{props.user.name}</Text>
            </ListItem>
            <ListItem>
                <Left>
                    <Icon name="mail" style={styles.icons}/>
                </Left>
                <Text>{props.user.email}</Text>
            </ListItem>
            <ListItem>
                <Left>
                    <Icon name="call" style={styles.icons}/>
                </Left>
                <Text>{props.user.phone}</Text>
            </ListItem>
        </Container>
    )
}

const styles = StyleSheet.create({
    icons: {
        color: '#AAAAAA',
        fontSize: 22
    }
});

export default userView;
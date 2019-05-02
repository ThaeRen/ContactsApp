import React, {Component} from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Container, Button, Text, Icon, StyleProvider, Root, Spinner, Toast } from 'native-base';
import material from '../native-base-theme/variables/material';
import getTheme from '../native-base-theme/components';
import firebase from 'react-native-firebase';
import { Navigation } from 'react-native-navigation';

import UserView from './components/UserView';

export default class ContactView extends Component {

  constructor(props) {
    super(props);
    this.contactRef = firebase.firestore().collection('contacts').doc(props.userId);
    this.unsubscribe = null;
  }

  componentDidMount() {
    this.unsubscribe = this.contactRef.onSnapshot(this.onCollectionUpdate) 
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  state = {
    user: {},
    loading: true
  }

  static options(passProps) {
    return {
        topBar: {
            title: {
                text: passProps.userName,
                color: '#FFFFFF',
                fontFamily: 'Helvetica',
                component: {
                    alignment: 'center'
                }
            },
            backButton: {
              color: material.brandWarning
            },
            background: {
              color: "#fff"
            },
            visible: false
        }
    };
  }

  onCollectionUpdate = (doc) => {
    let user = {};
    const { name, email, phone } = doc.data();

    user = {
      id: doc.id,
      doc, // DocumentSnapshot
      name,
      email,
      phone
    }

    this.setState({ 
      user,
      loading: false,
    });
  }

  deleteContact = () => {
    Alert.alert(
      'Excluir Contato',
      `Tem certeza que deseja excluir o contato ${this.state.user.name}?`,
      [
        {text: 'Não', style: 'cancel',},
        {text: 'Sim', onPress: () => {
          this.unsubscribe();
          this.setState({loading: true})
          this.contactRef.delete()
            .then(() => {
              this.setState({loading: false})
              Navigation.pop(this.props.componentId)
            })
            .catch(() => {
              this.setState({loading: false})
              Toast.show({
                text: 'O banco de dados não está respondendo no momento. Tente novamente mais tarde.',
                buttonText: 'Ok'
              })
            })
        }},
      ]
    );
  }

  goToEditContact = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'AddContact',
        passProps: {
          user: this.state.user
        }
      }
    });
  }

  render() {
    console.log("PROPS -> " + this.props.userId)
    let content;
    if(!this.state.loading) {
      content = <UserView user={this.state.user} />
    } else {
      content = <Container style={styles.loading}>
                  <Spinner/>
                  <Text>Carregando Informações...</Text>
                </Container>
    }
    return (
      <Root>
        <StyleProvider style={getTheme(material)}>
          <Container>
            {content}
            <Button style={{marginTop: 32, backgroundColor: "#682670", marginHorizontal: 16}} block rounded onPress={this.goToEditContact}>
                <Icon name="create"/>
                <Text>Editar Contato</Text>
            </Button>
            <Button style={{marginTop: 16, backgroundColor: "#961f0f", marginHorizontal: 16}} block rounded onPress={this.deleteContact}>
                <Icon name="trash"/>
                <Text>Excluir Contato</Text>
            </Button>
          </Container> 
        </StyleProvider>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
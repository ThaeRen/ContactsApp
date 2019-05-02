import React, {Component} from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Fab, Text, Icon, StyleProvider, Root, Spinner, Item, Header, Input } from 'native-base';
import material from '../native-base-theme/variables/material';
import getTheme from '../native-base-theme/components';
import firebase from 'react-native-firebase';
import { Navigation } from 'react-native-navigation';

import UserListItem from "./components/UserListItem";

export default class ContactsList extends Component {

    constructor() {
        super();
        this.contactsRef = firebase.firestore().collection('contacts');
        this.unsubscribe = null;
    }

    componentDidMount() {
        this.unsubscribe = this.contactsRef.onSnapshot(this.onCollectionUpdate) 
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }

    state = {
        users: [],
        loading: true,
        search: '',
        searchBarIcon: 'people'
    }

    static options(passProps) {
        return {
            topBar: {
                title: {
                    text: 'Lista de Contatos',
                    color: '#FFFFFF',
                    fontFamily: 'Helvetica',
                    component: {
                        alignment: 'center'
                    }
                },
                background: {
                    color: "#FFFFFF"
                },
                visible: false,
                drawBehind: true
            }
        };
    }

    goToAddUser = () => {
        Navigation.push(this.props.componentId, {
            component: {
              name: 'AddContact',
              passProps: {
                  user: {name: '', phone: '', email: '', id: undefined}
              }
            }
        });
    }

    goToViewUser = (user) => {
        Navigation.push(this.props.componentId, {
            component: {
              name: 'ContactView',
              passProps: {
                userId: user.id,
                userName: user.name
              }
            }
        });
    }

    updateSearch = (e) => {
        text =  e.nativeEvent.text
        if(text.length >= 1) {
            this.setState({searchBarIcon: 'close'})
        } else {
            this.setState({searchBarIcon: 'people'})
        }
        this.setState({search: text})
    }

    resetSearch = () => {
        if(this.state.searchBarIcon === 'close') {
            this.setState({search: '', searchBarIcon: 'people'})
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
            const { name, email, phone } = doc.data();
            
            users.push({
                id: doc.id,
                doc, // DocumentSnapshot
                name,
                email,
                phone
            });
        });

        users = users.sort((a, b) => {
            let nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
            if(nameA < nameB)
                return -1
            if(nameA > nameB)
                return 1
            return 0
        })

        this.setState({ 
            users,
            loading: false,
        });
    }
    
    render() {
        let content
        let searchBar
        if(!this.state.loading) {
            if(this.state.users.length > 0) {
                searchBar = <Header transparent searchBar rounded>
                                <Item>
                                    <Icon name="search" />
                                    <Input placeholder="Buscar Contato" onChange={this.updateSearch} value={this.state.search}/>
                                </Item>
                            </Header>
                content =   <FlatList 
                                data={this.state.users.filter(user => user.name.includes(this.state.search))} 
                                renderItem={({item}) => <UserListItem
                                                            userName={item.name}
                                                            onItemPressed = {() => this.goToViewUser(item)}
                                                        />
                                            }
                                keyExtractor={(item, index) => index.toString()}
                            />
            } else {
                searchBar = null
                content = <Container style={styles.center}>
                            <Text style={{textAlign: 'center'}}>Você não possui contatos cadastrados!</Text>
                            <Text style={{textAlign: 'center'}}>Para cadastrar um contato, clique no botão de 'Cadastrar Novo Contato'!</Text>                            
                          </Container>
            }
        } else {
            searchBar = null
            content = <Container style={styles.center}>
                        <Spinner/>
                        <Text>Carregando Contatos...</Text>
                      </Container>
        }
        return (
            <Root>
                <StyleProvider style={getTheme(material)}>
                    <Container>
                        {searchBar}
                        {content}
                        <View style={styles.buttons}>
                            <Fab style={{backgroundColor: "#682670"}} onPress={this.goToAddUser}>
                                <Icon name="add"/>
                            </Fab>
                        </View>
                    </Container>
                </StyleProvider>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    buttons: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
  });
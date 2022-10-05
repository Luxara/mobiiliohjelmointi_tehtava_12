import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import {initializeApp} from 'firebase/app';
import {getDatabase, push, child, update, ref, onValue, remove} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD12OpA7S8zBWwzHD0_2nnZsahTJ8DdKpE",
  authDomain: "shopping-list-832c3.firebaseapp.com",
  databaseURL: "https://shopping-list-832c3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-832c3",
  storageBucket: "shopping-list-832c3.appspot.com",
  messagingSenderId: "566118223403",
  appId: "1:566118223403:web:bcab80d367fde05146646e",
  measurementId: "G-TML61112HM"
};

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

export default function App() {
  
  const [listItem, setListItem] = useState('');
  const [amount, setAmount] = useState('');
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'listItems/');
    onValue(itemsRef, (snapshot) => { 
    const data = snapshot.val();
    setListItems(Object.values(data));
    })  
    }, []);

  
  const addItem = () =>{  
    const id = push(child(ref(database), 'listItems')).key;
    const addItem = ref(database, 'listItems/' + id)

    update(
      addItem,
      {'id':id, 'product':listItem, 'amount':amount});  
  }

  const deleteItem = (id) =>{
    remove(ref (database, 'listItems/'+id))
  }


  return (
    <View style={styles.container}>
      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <TextInput placeholder='item' style={styles.input} onChangeText={listItem=>setListItem(listItem)} value={listItem}/>
        <TextInput placeholder='amount' style={styles.input} onChangeText={amount=>setAmount(amount)} value={amount}/>
      </View>

      <View style={{position: 'relative', top:30}}>
      <View style={{flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'space-around', marginTop:'-50%'}}>
      <Button onPress={addItem} title='ADD'/>
      </View>
      </View>

      <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <Text>Shopping List</Text>
      <FlatList
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize:18, marginRight:'10%'}}>{item.product}, {item.amount}</Text>
      <Text style={{fontSize:18, color: 'red'}} onPress={() => deleteItem(item.id)}>bought</Text></View>}  
      data={listItems}
      />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },  
  
  input: {
    width:200,
    borderColor:'gray',
    borderWidth:1
  },

  listcontainer:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  } 
});

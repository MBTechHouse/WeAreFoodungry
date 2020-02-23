import React from 'react';
import { StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { Layout, Text, Icon } from 'react-native-ui-kitten';
import {BoxShadow} from 'react-native-shadow';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Viewport } from '@skele/components'
import firebase from 'firebase'
import {LeftArrow, RightArrow} from '../resources/icons/Icons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Overlay, Input, Button } from 'react-native-elements';

const ViewportAwareView = Viewport.Aware(View)

export default class ManageItems extends React.Component{

  screenWidth = Dimensions.get('screen').width
  screenHeight = Dimensions.get('screen').height

  state = {
    isVisible:false,
    items: {},
    cart:{},
    totalPrice: 0,
    totalItems: 0,
    categoryList:[],
    foodItemName:"",
    foodItemDescription: "",
    foodItemActualPrice: 0,
  currentCategorySelected:null
  }

  async fetchItemsFromDB(restUUID) {
    categoryList = []
    items = {}
    await firebase.database().ref(`restaurants/${restUUID}/categories`).on('value',(categories=>{
      firebase.database().ref(`restaurants/${restUUID}/foodItems`).on('value',(foodItems=>{
      Object.entries(categories.val()).map(([categoryId, categoryVal])=>{
        let categoryObject = {...categoryVal}
        categoryObject["categoryId"] = categoryId
        categoryList.push(categoryObject)
        items[categoryId] = []
      })
      Object.entries(foodItems.val()).map(([foodItemId, foodItem])=>{
        let foodObject = {...foodItem}
        foodObject["quantity"] = 0
        foodObject["foodItemId"] = foodItemId
        foodObject["type"] = 0
        items[foodItem.category].push(foodObject)
      })
      this.setState({categoryList:categoryList, currentCategorySelected:categoryList[0].categoryId, items:items})
      }))
    }))
  }

  componentDidMount() {
    let restUUID = firebase.auth().currentUser.uid
    this.fetchItemsFromDB(restUUID)
  }

  shiftCategory = (direction, categoryId, currentSelected=false) => {
    let categoryList = [...this.state.categoryList]
    let categoryIndex = 0
    for(categoryIndex=0;categoryIndex<categoryList.length;categoryIndex++){
        if(categoryList[categoryIndex].categoryId==categoryId){
            break
        }
    }
    let tempCategory = categoryList[categoryIndex];
    if(direction) {
        categoryList[categoryIndex] = categoryList[categoryIndex+1];
        categoryList[categoryIndex+1] = tempCategory; 
    } else {
        categoryList[categoryIndex] = categoryList[categoryIndex-1];
        categoryList[categoryIndex-1] = tempCategory;
    }
    this.setState({categoryList:categoryList})
  }

  shiftFoodItems = (direction, foodItemId) => {
  let items = {...this.state.items}
  let itemsList = items[this.state.currentCategorySelected]
  let foodIndex = 0
  for(foodIndex=0;foodIndex<itemsList.length;foodIndex++){
      if(itemsList[foodIndex].foodItemId==foodItemId){
          break
      }
  }
  let tempFoodItem = itemsList[foodIndex];
  if(!direction) {
    itemsList[foodIndex] = itemsList[foodIndex+1];
    itemsList[foodIndex+1] = tempFoodItem; 
  } else {
    itemsList[foodIndex] = itemsList[foodIndex-1];
    itemsList[foodIndex-1] = tempFoodItem;
  }
  items[this.state.currentCategorySelected] = itemsList
  this.setState({items:items})
}

  addItemToList() {
      let items = {...this.state.items}
      let title = this.state.foodItemName
      let description = this.state.foodItemDescription
      let actualPrice = this.state.foodItemActualPrice
      if(title!=="" && actualPrice!=="") {
        if(/^\d+$/.test(actualPrice)) {
            let itemObject = {} 
            itemObject["foodItemId"] = "food_"+Math.round((new Date()).getTime() / 1000);
            itemObject["category"] = this.state.currentCategorySelected
            itemObject["title"] = title
            itemObject["description"] = description
            itemObject["actualPrice"] = actualPrice
            itemObject["type"] = 0
            items[this.state.currentCategorySelected].push(itemObject)
            this.setState({items:items, isVisible:false})
        } else {
            alert("Please enter valid price")
        }
      } else
        alert("Please fill mandatory fields")
  }

  
  deleteFoodItem(foodItemId){
    let items = {...this.state.items}
    let itemsList = items[this.state.currentCategorySelected]
    let foodIndex = 0
    for(foodIndex=0;foodIndex<itemsList.length;foodIndex++){
        if(itemsList[foodIndex].foodItemId==foodItemId){
            break
        }
    }
    itemsList.splice(foodIndex, 1); 
    items[this.state.currentCategorySelected] = itemsList
    this.setState({items:items})
  }

  renderItemList()
  {

    var items = []
    if(this.state.currentCategorySelected!==null) {
    var stateItems = this.state.items[this.state.currentCategorySelected]
    Object.entries(stateItems).forEach(([key,item]) => {
      items.push(<BoxShadow setting={{
        width: this.screenWidth *0.95,
        height: this.screenHeight * 0.15,
        color: '#000',
        border: 5,
        opacity: 0.2,
        x: 0,
        y: 4,
        radius:this.screenHeight*0.02,
        style:{
          marginTop:this.screenHeight*0.01,
          marginBottom: this.screenHeight*0.015
        }
      }}>
      <View style={{width:this.screenWidth *0.95, flexDirection:'row', height:this.screenHeight*0.15, backgroundColor:'#fff', borderRadius:this.screenHeight*0.02,}} >
        <View style={{height:'100%', width:'3%', backgroundColor:(item.type == 0)?'green':(item.type == 1)?'#795548':'#d32f2f', borderTopLeftRadius:this.screenHeight*0.02, borderBottomLeftRadius:this.screenHeight*0.02}}>
          <Text></Text>
        </View>
      <View style={{width:'80%', marginLeft:'4%', justifyContent:'space-around'}}>
        <View>
          <Text style={{fontWeight:'bold', fontSize:19, width:'60%'}}>{item.title}</Text>
        <Text style={{fontSize:16, color:'#757575', marginTop:'1%'}}>{item.description}</Text>
        </View>
        <View style={{flexDirection:'row',  marginBottom:'2%',height:'20%', alignItems:'center'}}>
          <Image source={require('../resources/icons/rupee.png')} style={{width:15, height:15}} resizeMode="contain" />
          <Text style={{fontSize:18, color:'#0092cc',marginLeft:'1%',}}>{item.actualPrice}</Text>
          </View>
      </View>
      <View style={{height:'100%', justifyContent:'center', alignItems:'center'}}>
      {this.state.items[this.state.currentCategorySelected][0].foodItemId !== item.foodItemId ?
          <Ionicons
            name="ios-arrow-dropup-circle" 
            size={30} 
            color="#55C2FF"
            onPress={()=>{this.shiftFoodItems(1, item.foodItemId)}}
        /> : null}
        <MaterialIcons
            name="delete" 
            size={30} 
            color="#ef5350"
            onPress={()=>{this.deleteFoodItem(item.foodItemId)}}
        />
        {this.state.items[this.state.currentCategorySelected].length!==undefined && this.state.items[this.state.currentCategorySelected][this.state.items[this.state.currentCategorySelected].length-1].foodItemId !== item.foodItemId ?
        <Ionicons
            name="ios-arrow-dropdown-circle" 
            size={30} 
            color="#55C2FF"
            onPress={()=>{this.shiftFoodItems(0, item.foodItemId)}}
        /> : null}
      </View>
  </View>
  </BoxShadow>)
    })
  }
  items.push(
    <BoxShadow setting={{
        width: this.screenWidth *0.95,
        height: this.screenHeight * 0.15,
        color: '#fff',
        border: 5,
        opacity: 0.2,
        x: 0,
        y: 4,
        radius:this.screenHeight*0.02,
        style:{
          marginTop:this.screenHeight*0.01,
          marginBottom: this.screenHeight*0.015,
        }
      }}>
      <TouchableHighlight 
      style={{
          width:this.screenWidth *0.95, 
          flexDirection:'row', 
          height:this.screenHeight*0.15, 
          backgroundColor:'#fff', 
          borderRadius:this.screenHeight*0.02,
          borderStyle:'dashed',
          borderWidth:3,
          borderColor:"#55C2FF80",
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:"#55C2FF30"}} 
        onPress={()=>{this.setState({isVisible:true})}}>
        <AntDesign
            name="pluscircle" 
            size={45} 
            color="#55C2FF"
        />
      </TouchableHighlight>
      </BoxShadow>
  )
    return items
  }

  handlePills(text)
  {
    let pillsarr = text.split(',')
    let pillsView = []
    pillsarr.forEach(pills=>{
      pillsView.push(<View style={{padding:5, borderRadius:9, backgroundColor:'#fff',marginLeft:5, marginRight:10 }}>
        <Text>{pills}</Text>
      </View>)
    })
    return pillsView
  }

  
  _handleViewportEnter = ()=>{
  }

  _handleViewportLeave = ()=>{
  }

  render()
  {
  return(
    <View>
      <Viewport.Tracker>
  <ScrollView style={styles.container} >
    
    <ViewportAwareView 
        onViewportEnter={this._handleViewportEnter}
        onViewportLeave={this._handleViewportLeave}>
    <View style={{flex:1, alignItems:'center', height:this.screenHeight*0.58,}}>
      <Image source={require('../resources/Images/food1.jpeg')} style={{width:'100%', height: this.screenHeight*0.45, marginBottom:'3%'}} />
      
      <BoxShadow
          setting={{
            width: this.screenWidth * 0.9,
            height: this.screenHeight * 0.25,
            color: '#000',
            border: 5,
            opacity: 0.2,
            x: 0,
            y: 4,
            radius:10,
            style: {
              marginVertical: 5,
              marginLeft: this.screenWidth * 0.04,
              marginRight: this.screenWidth * 0.04,
              position:'absolute', top:this.screenHeight*0.30,
            },
          }}>
      <View style={{height: this.screenHeight*0.25,borderRadius:10,  backgroundColor:'#55c2ff'}}>
        <View style={{width:'90%', flexDirection:'row',  justifyContent:'center',}}>
          <Text category="h4" style={{ fontWeight:'bold', width:'90%', color:'#fff', top:this.screenHeight*0.03, left:this.screenWidth*0.06}}>Domino's Pizza</Text>
            <View style={{borderRadius:3,padding:'1.2%', backgroundColor:'#7cb342'}}>
              <Text style={{color:'#fff'}}>4.5</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', top:this.screenHeight*0.04, left:this.screenWidth*0.08}}>{this.handlePills("Fast Food, Pizza")}</View>
          <Text style={{color:'#272727',top:this.screenHeight*0.07, left:this.screenWidth*0.08, fontWeight:'bold'}}>Banashankari 3rd Stage</Text>
          <Text style={{color:'#272727',top:this.screenHeight*0.08, left:this.screenWidth*0.08, fontWeight:'bold'}}>Cost for one:- $200</Text>
        </View>
        </BoxShadow>
    </View>
    </ViewportAwareView>
    <View style={{width:'100%',height:this.screenHeight*0.1,top:this.screenHeight*0.035}}>
    <ScrollView style={{flex:1, }} horizontal={true} showsHorizontalScrollIndicator={false}>
    {
      this.state.categoryList.map(category=>{
        if(this.state.currentCategorySelected==category.categoryId)
        {
          return <View 
        style={{
        flexDirection:'row', 
        marginLeft:this.screenWidth*0.03,
        marginRight:this.screenWidth*0.03,
        }}>
            {category.categoryId!==this.state.categoryList[0].categoryId? (<LeftArrow onIconPress={()=>this.shiftCategory(0,category.categoryId)}/>):null}
            <TouchableOpacity 
        style={{ height:'100%',
        paddingLeft:this.screenWidth*0.01,
        paddingRight:this.screenWidth*0.01,
        alignItems:'center',
        paddingTop: '4%'
        }}>
            <Text style={{fontSize:16,marginBottom:this.screenHeight*0.01,color:'#0092cc', fontWeight:'bold'}}>{category.name}</Text>
            <View style={{borderRadius:this.screenWidth*0.01/2,width:this.screenWidth*0.1, height:this.screenHeight*0.007, backgroundColor:'#55c2ff'}}>
              <Text></Text>
            </View>
          </TouchableOpacity>

          {category.categoryId!==this.state.categoryList[this.state.categoryList.length-1].categoryId?<RightArrow onIconPress={()=>this.shiftCategory(1,category.categoryId)}/>:null}
          </View>
        }
        return <View 
        style={{
        flexDirection:'row', 
        marginLeft:this.screenWidth*0.03,
        marginRight:this.screenWidth*0.03,
        }}>
            {category.categoryId!==this.state.categoryList[0].categoryId? (<LeftArrow onIconPress={()=>this.shiftCategory(0,category.categoryId)}/>):null}
        <TouchableOpacity 
        style={{ height:'100%',
        paddingLeft:this.screenWidth*0.01,
        paddingRight:this.screenWidth*0.01,
        alignItems:'center',
        paddingTop: '4%'}}
        onPress={()=>{this.setState({currentCategorySelected:category.categoryId})}}
        >
            <Text style={{fontSize:16}}>{category.name}</Text>
          </TouchableOpacity>

          {category.categoryId!==this.state.categoryList[this.state.categoryList.length-1].categoryId?<RightArrow onIconPress={()=>this.shiftCategory(1,category.categoryId)}/>:null}
          </View>
        
      })
    
    }
    </ScrollView>
    </View>

    <Layout style={{paddingLeft:'2%'}}>

      {this.renderItemList()}

    </Layout>

    <Layout style={{height:this.screenHeight*0.2}}>
      <Text></Text>
    </Layout>

  </ScrollView>
  </Viewport.Tracker>
  <Overlay
  isVisible={this.state.isVisible}
  onBackdropPress={() => this.setState({ isVisible: false })}
  borderRadius={20}
  height="70%"
  containerStyle={{marginTop:'8%'}}
>
    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
  <Text style={{fontSize:18, fontWeight:'bold'}}>Enter Item Details</Text>
  <Input
label="Title"
  placeholder='Enter Item title'
  onChangeText={text => this.setState({foodItemName:text})}
  value={this.state.foodItemName}
    />
    <Input
    label="Description"
  placeholder='Enter Item description'
  onChangeText={text => this.setState({foodItemDescription:text})}
  value={this.state.foodItemDescription}
  containerStyle={{marginTop:'8%'}}
    />
    <Input

label="Price"
  placeholder='Enter Item price'
  onChangeText={text => this.setState({foodItemActualPrice:text})}
  value={this.state.foodItemActualPrice}
  containerStyle={{marginTop:'8%'}}
  keyboardType="numeric"
/>
<View style={{flexDirection:'row', marginTop:'7%', width:'50%', justifyContent:'space-between', alignItems:'center'}}>
<Button
  title="Add"
  rasied={true}
  buttonStyle={{backgroundColor:'#4caf50'}}
  onPress={this.addItemToList.bind(this)}
/>
<Button
  title="Cancel"
  rasied={true}
  buttonStyle={{backgroundColor:'#ef5350'}}
  onPress={()=>this.setState({ isVisible: false })}
/>
</View>

  </View>
</Overlay>

  </View>
  )
  }
}

const styles = StyleSheet.create({
  container: { height:'100%',width:'100%',  backgroundColor:'#fff' },
  text: { marginVertical: 16 },
});

import { updateDB, getFavs } from "../firebase"
import ApolloClient, { gql } from "apollo-boost"

//constantes
let initialData = {
    fetching : false,
    array : [],
    current : {},
    favorites : [],
    nextPage: 1
}


let client = new ApolloClient({
    uri : "https://rickandmortyapi.com/graphql"
})

let UPDATE_PAGE = "UPDATE_PAGE"

let GET_CHARACTERS = "GET_CHARACTERS"
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS"
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR"

let REMOVE_CHARACTER = "REMOVE_CHARACTER"

let ADD_TO_FAVORITE = "ADD_TO_FAVORITE"

let GET_FAVS = "GET_FAVS"
let GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS"
let GET_FAVS_ERROR = "GET_FAVS_ERROR"

//reducer 
export default function reducer(state =initialData, action){
    switch(action.type){
        case UPDATE_PAGE:
            return {...state, nextPage : action.payload}
        case GET_FAVS:
            return {...state, fetching:true}
        case GET_FAVS_SUCCESS: 
            return {...state, fetching:false, favorites : action.payload}
        case GET_FAVS_ERROR:   
            return {...state, fetching:false, error : action.payload}
        case ADD_TO_FAVORITE:
            return {...state, ...action.payload }
        case REMOVE_CHARACTER:
            return {...state,array: action.payload}
        case GET_CHARACTERS :
            return {...state, fetching:true}
        case GET_CHARACTERS_SUCCESS : 
            return {...state, array: action.payload, fetching:false}
        case GET_CHARACTERS_ERROR :
            return {...state, fetching:false, error : action.payload}
        default : 
            return state
    }
}
//actions
export let retrieveFavsActions = () => (dispatch,getState) => {
    dispatch({
        type: GET_FAVS
    })
    let storage = localStorage.getItem("storage")
    storage = JSON.parse(storage)
    if(storage){
        let { uid } = storage.user
        return getFavs(uid) 
            .then( array=>{
                dispatch({
                    type: GET_FAVS_SUCCESS,
                    payload : [...array]
                })
            } )
            .catch(e=>{
                console.log(e)
                dispatch({
                    type:GET_FAVS_ERROR,
                    payload : e.message
                })
            })
    }
}

export let addToFavoritesAction = () => (dispatch,getState) =>{
    let { array, favorites } = getState().character
    let { uid } = getState().user 
    let char = array.shift()
    favorites.push(char)
    updateDB(favorites,uid) 
    dispatch({
        type : ADD_TO_FAVORITE,
        payload : {array:[...array], favorites:[...favorites]}
    })
}

export let removeCharacterAction = () => (dispatch,getState)=>{
    let { array } = getState().character
    array.shift()
    if(!array.length){
        getCharactersAction()(dispatch,getState)
    } 
    dispatch({
        type: REMOVE_CHARACTER,
        payload: [...array]
    })
}

export let getCharactersAction = () => (dispatch, getState)=>{
    let query = gql`
    query ($page:Int){
        characters(page:$page){
            info{
                pages
                next
                prev
            }
            results{
                name
                image
            }
        }
    }
    `
    dispatch({
        type: GET_CHARACTERS
    })
    let { nextPage } = getState().character
    return client.query({
        query,
        variables:{page : nextPage}
    })
    .then(({data,error}) =>{
        if(error){
            dispatch({
                type:GET_CHARACTERS_ERROR,
                payload : error
            })
            return
        }
        dispatch({
            type:GET_CHARACTERS_SUCCESS,
            payload:data.characters.results
        })
        dispatch({
            type : UPDATE_PAGE,
            payload : data.characters.info.next ?  data.characters.info.next : 1
        })

    })
    }
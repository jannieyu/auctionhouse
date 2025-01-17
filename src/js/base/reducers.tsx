import { Auction } from "./types"
import { determineAuctionState } from "./util"

export interface BidHistory {
  id?: number
  bidderId: number
  itemId: number
  bidPrice: string
  createdAt: string
}

export enum BroadcastType {
  NEW_NOTIFICATION = "NEW_NOTIFICATION",
  NEW_BID = "NEW_BID",
  UPDATE_ITEM = "UPDATE_ITEM",
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  bio?: string
  image?: string
}

export enum NotificationType {
  OUTBID = "OUTBID",
  WON = "WON",
  LOST = "LOST",
  ITEM_BID_ON = "ITEM_BID_ON",
  ITEM_SOLD = "ITEM_SOLD",
  BIDBOT_DEACTIVATED = "BIDBOT_DEACTIVATED",
  BIDBOT_BID = "BIDBOT_BID",
  ITEM_DELISTED = "ITEM_DELISTED",
  BIDBOT_DEACTIVATED_ITEM_DELISTED = "BIDBOT_DEACTIVATED_ITEM_DELISTED",
  BIDBOT_DEACTIVATED_AUCTION_END = "BIDBOT_DEACTIVATED_AUCTION_END",
  ITEM_NOT_SOLD = "ITEM_NOT_SOLD",
}

export interface Notification {
  noteType: NotificationType
  id: number
  seen: boolean
  itemId?: number
  userId?: number
  price?: string

  itemName?: string
  userFirstName?: string
  userLastName?: string
  userEmail?: string
  senderId?: number
}

export interface ListingState {
  name: string
  startingPrice: string
  category: string
  condition: string
  description: string
  imageURL: string
  bids: BidHistory[]
  highestBid: string
  sellerId: number
}
export interface SearchItem {
  category: string
  condition: string
  description: string
  numBids: number
  numClicks: number
  highestBid: string
  id: number
  image: string
  name: string
  price: string
  seller: User
  sellerId: number
  active: boolean
  bids: BidHistory[]
}

export interface Broadcast {
  broadcastType: BroadcastType
  data?: BidHistory | SearchItem
}

const initialState = {
  numClicks: 0 as number,
  user: null as User | null,
  showLoginModal: false as boolean,
  isSignUp: true as boolean,
  searchItems: [] as SearchItem[],
  listingState: {} as ListingState,
  numUnseenNotifs: 0 as number,
  auction: null as Auction | null,
}

export type AppState = typeof initialState

export enum ActionType {
  SET_DATA = "SET_DATA",
  UPDATE_SEARCH_ITEM = "UPDATE_SEARCH_ITEM",
  UPDATE_LISTING_STATE = "UPDATE_LISTING_STATE",
  CLEAR_LISTING_STATE = "CLEAR_LISTING_STATE",
  CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION",
  RECEIVE_NOTIFICATION = "RECEIVE_NOTIFICATION",
  UPDATE_AUCTION_STATE = "UPDATE_AUCTION_STATE",
}

export type SearchItemAction = {
  data: Partial<SearchItem>
  itemId: number
  newBid?: BidHistory
}

export type ActionPayload = Partial<AppState> | SearchItemAction | Partial<ListingState>

export interface Action {
  type: ActionType
  payload: ActionPayload
}

// eslint-disable-next-line default-param-last
export const rootReducer = (state: AppState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SET_DATA: {
      return { ...state, ...action.payload }
    }
    case ActionType.UPDATE_SEARCH_ITEM: {
      const { data, itemId, newBid } = action.payload as SearchItemAction
      return {
        ...state,
        searchItems: state.searchItems.map((item: SearchItem) =>
          item.id === itemId
            ? {
                ...item,
                ...data,
                bids: newBid ? [...item.bids, newBid] : item.bids,
                numBids: newBid ? item.bids.length + 1 : item.bids.length,
                highestBid: newBid ? newBid.bidPrice : item.highestBid,
              }
            : item,
        ),
      }
    }
    case ActionType.UPDATE_LISTING_STATE: {
      const listingState = action.payload as ListingState
      return {
        ...state,
        listingState: { ...state.listingState, ...listingState },
      }
    }
    case ActionType.CLEAR_LISTING_STATE: {
      return {
        ...state,
        listingState: {},
      }
    }
    case ActionType.CLEAR_NOTIFICATION: {
      return {
        ...state,
        numUnseenNotifs: Math.max(0, state.numUnseenNotifs - 1),
      }
    }
    case ActionType.RECEIVE_NOTIFICATION: {
      return {
        ...state,
        numUnseenNotifs: state.numUnseenNotifs + 1,
      }
    }
    case ActionType.UPDATE_AUCTION_STATE: {
      return {
        ...state,
        auction: { ...state.auction, state: determineAuctionState(state.auction) },
      }
    }
    default: {
      return state
    }
  }
}

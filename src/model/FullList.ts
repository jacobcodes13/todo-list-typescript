import ListItem from "./ListItem";

interface List {
  list: ListItem[],
  load(): void,
  save(): void,
  clearList(): void,
  addItem(itemObj: ListItem): void,
  clearInput(): void,
  removeItem(id: string): void
}

export default class FullList implements List {

  static instance: FullList = new FullList()

  private constructor(private _list: ListItem[] = []) {}

  get list(): ListItem[] {
    return this._list
  }

  // load is grabbing the stringified list and parsing it
  load(): void {
    const storedList: string | null = localStorage.getItem("myList")
    if (typeof storedList !== "string") return

    const parsedList: { _id: string, _item: string, _checked: boolean }[] = JSON.parse(storedList)

    parsedList.forEach(itemObj => {
      const newListItem = new ListItem(itemObj._id, itemObj._item, itemObj._checked)
      FullList.instance.addItem(newListItem)
    })
  }

  // saves to localStorage under myList
  save(): void {
    localStorage.setItem("myList", JSON.stringify(this._list))
  }

  // clearList sets the list to an empty array
  clearList(): void {
    this._list = []
    this.save() 
  }

  // addItem takes in a itemObj thats called ListItem
  addItem(itemObj: ListItem): void {
    this._list.push(itemObj);
    this.save();

    // Clear the input after adding the item
    this.clearInput();
  }

  clearInput(): void {
    const inputElement = document.getElementById('newItem') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  // removeItem takes in an id and removes the item with the id we selected
  removeItem(id: string): void {
    this._list = this._list.filter(item => item.id !== id)
    this.save()
  }
}
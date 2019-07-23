const style = {}

style.todoItem = (draggableStyle) => ({
    background: '#f7f7f7',
    borderRadius: 0.2,
    width: 'auto',
    marginTop: 0,
    marginBottom: 10,
    ...draggableStyle,
})

style.column = {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
}

export default style
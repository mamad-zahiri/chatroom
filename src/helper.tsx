import stc from "string-to-color"

const creatAvatarLink = (email: string): string => {
    const text = email.slice(0, 2).toUpperCase()
    const color = stc(email)
    return `https://placehold.co/200x200/${color.slice(
        1,
    )}/ffffff.svg?text=${text}&font=Lato`
}

export { creatAvatarLink }

interface ListProps {
    tech: string;
}

//구조분해할당 사용
const List = ({tech}: ListProps) => {
    return (
        <li style={{listStyle: 'none'}}>
            {tech}
        </li>
    )
}

export default List;
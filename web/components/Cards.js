import { Card } from 'antd';

const Cards = (props) => (
	<>
    <Card
			size={props.size}
      title= {props.title}
      extra={props.extra}
      style={{
        width: 300,
      }}
			actions={props.actions}
			cover={props.cover}
    >
      { props.children }
    </Card>
  </>
);

export default Cards;
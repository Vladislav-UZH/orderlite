import { useNavigate } from 'react-router';
import { Screen, Header, Title, Button, Text } from '../components/ui/ui-kit';

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Screen>
      <Header>
        <span />
        <Title>404</Title>
        <span />
      </Header>

      <div className="container" style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🥲</div>
        <h2 style={{ margin: '0 0 8px' }}>Order not found</h2>
        <Text style={{ marginBottom: 16 }}>
          Схоже, ви потрапили на неіснуючий маршрут. Можливо, це було старе замовлення або помилка в
          URL.
        </Text>

        <Button full onClick={() => navigate('/menu')}>
          Повернутись до меню
        </Button>

        <Button variant="subtle" full style={{ marginTop: 8 }} onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
    </Screen>
  );
};

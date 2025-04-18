import AppLayout from './components/layout/AppLayout';
import Router from '@/routes';

export default function App() {
  return (
    <AppLayout>
      <Router />
    </AppLayout>
  );
}

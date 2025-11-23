import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  trainNumber: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  class: string;
  seats: string;
  price: number;
  status: "active" | "completed" | "cancelled";
  bookingDate: string;
}

const MyTickets = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const mockTickets: Ticket[] = [
    {
      id: "TK001",
      trainNumber: "002А",
      from: "Москва",
      to: "Санкт-Петербург",
      date: "25 января 2025",
      departure: "12:30",
      arrival: "08:45",
      duration: "20ч 15м",
      class: "Купе",
      seats: "12, 13",
      price: 9780,
      status: "active",
      bookingDate: "15 января 2025",
    },
    {
      id: "TK002",
      trainNumber: "030А",
      from: "Москва",
      to: "Казань",
      date: "10 февраля 2025",
      departure: "23:45",
      arrival: "19:20",
      duration: "19ч 35м",
      class: "Плацкарт",
      seats: "24",
      price: 2650,
      status: "active",
      bookingDate: "20 января 2025",
    },
    {
      id: "TK003",
      trainNumber: "016Ч",
      from: "Санкт-Петербург",
      to: "Москва",
      date: "10 января 2025",
      departure: "15:20",
      arrival: "11:35",
      duration: "20ч 15м",
      class: "СВ",
      seats: "3",
      price: 8490,
      status: "completed",
      bookingDate: "5 января 2025",
    },
    {
      id: "TK004",
      trainNumber: "002А",
      from: "Москва",
      to: "Екатеринбург",
      date: "5 января 2025",
      departure: "12:30",
      arrival: "08:45",
      duration: "26ч 15м",
      class: "Купе",
      seats: "18, 19",
      price: 11560,
      status: "cancelled",
      bookingDate: "1 января 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
      active: { variant: "default", label: "Активен" },
      completed: { variant: "secondary", label: "Завершён" },
      cancelled: { variant: "destructive", label: "Отменён" },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const filterTickets = (status?: string) => {
    if (!status) return mockTickets;
    return mockTickets.filter((ticket) => ticket.status === status);
  };

  const handleShowDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Train" size={36} className="text-white" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">РЖД Экспресс</h1>
                <p className="text-sm text-blue-100">Система бронирования билетов</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <Button variant="ghost" className="text-white hover:bg-blue-600" onClick={() => navigate("/")}>
                Главная
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-600">
                Мои билеты
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-600">
                Расписание
              </Button>
              <Button variant="ghost" className="text-white hover:bg-blue-600">
                Контакты
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-2">Мои билеты</h2>
              <p className="text-muted-foreground">История заказов и активные билеты</p>
            </div>
            <Button onClick={() => navigate("/")} size="lg">
              <Icon name="Plus" size={20} className="mr-2" />
              Купить билет
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full md:w-[500px] grid-cols-4">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="completed">Завершённые</TabsTrigger>
              <TabsTrigger value="cancelled">Отменённые</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filterTickets().map((ticket) => (
                <Card key={ticket.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {ticket.trainNumber}
                          </Badge>
                          {getStatusBadge(ticket.status)}
                          <span className="text-sm text-muted-foreground ml-auto lg:ml-0">
                            Заказ от {ticket.bookingDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Icon name="Calendar" size={18} className="text-primary" />
                              <span className="font-semibold">{ticket.date}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">{ticket.departure}</div>
                                <div className="text-sm text-muted-foreground">{ticket.from}</div>
                              </div>
                              <Icon name="ArrowRight" size={20} className="text-primary" />
                              <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">{ticket.arrival}</div>
                                <div className="text-sm text-muted-foreground">{ticket.to}</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={18} className="text-muted-foreground" />
                              <span className="text-sm">Время в пути: {ticket.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Armchair" size={18} className="text-muted-foreground" />
                              <span className="text-sm">
                                {ticket.class}, места: {ticket.seats}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="CreditCard" size={18} className="text-muted-foreground" />
                              <span className="text-sm font-bold text-primary">{ticket.price} ₽</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2 justify-end">
                        <Button variant="outline" onClick={() => handleShowDetails(ticket)} className="flex-1 lg:flex-none">
                          <Icon name="FileText" size={18} className="mr-2" />
                          Детали
                        </Button>
                        {ticket.status === "active" && (
                          <>
                            <Button variant="outline" className="flex-1 lg:flex-none">
                              <Icon name="Download" size={18} className="mr-2" />
                              Скачать
                            </Button>
                            <Button variant="destructive" className="flex-1 lg:flex-none">
                              <Icon name="X" size={18} className="mr-2" />
                              Отменить
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {filterTickets("active").map((ticket) => (
                <Card key={ticket.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {ticket.trainNumber}
                          </Badge>
                          {getStatusBadge(ticket.status)}
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">{ticket.departure}</div>
                            <div className="text-sm text-muted-foreground">{ticket.from}</div>
                          </div>
                          <Icon name="ArrowRight" size={20} className="text-primary" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-secondary">{ticket.arrival}</div>
                            <div className="text-sm text-muted-foreground">{ticket.to}</div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {ticket.date} • {ticket.class} • Места: {ticket.seats}
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <Button variant="outline" onClick={() => handleShowDetails(ticket)}>
                          Детали
                        </Button>
                        <Button variant="outline">Скачать</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filterTickets("completed").map((ticket) => (
                <Card key={ticket.id} className="shadow-lg opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {ticket.trainNumber}
                          </Badge>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-bold">{ticket.from}</div>
                            <div className="text-sm text-muted-foreground">{ticket.departure}</div>
                          </div>
                          <Icon name="ArrowRight" size={20} />
                          <div>
                            <div className="font-bold">{ticket.to}</div>
                            <div className="text-sm text-muted-foreground">{ticket.arrival}</div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleShowDetails(ticket)}>
                        Детали
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {filterTickets("cancelled").map((ticket) => (
                <Card key={ticket.id} className="shadow-lg opacity-75">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {ticket.trainNumber}
                          </Badge>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-bold">{ticket.from}</div>
                            <div className="text-sm text-muted-foreground">{ticket.departure}</div>
                          </div>
                          <Icon name="ArrowRight" size={20} />
                          <div>
                            <div className="font-bold">{ticket.to}</div>
                            <div className="text-sm text-muted-foreground">{ticket.arrival}</div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => handleShowDetails(ticket)}>
                        Детали
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {mockTickets.length === 0 && (
            <Card className="shadow-xl text-center py-16">
              <CardContent>
                <Icon name="Ticket" size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">У вас пока нет билетов</h3>
                <p className="text-muted-foreground mb-6">Начните путешествие прямо сейчас</p>
                <Button onClick={() => navigate("/")} size="lg">
                  Купить первый билет
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Детали билета</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              <div className="bg-slate-100 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {selectedTicket.trainNumber}
                    </Badge>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <span className="text-sm text-muted-foreground">ID: {selectedTicket.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Отправление</div>
                    <div className="text-2xl font-bold text-secondary">{selectedTicket.departure}</div>
                    <div className="font-semibold">{selectedTicket.from}</div>
                    <div className="text-sm text-muted-foreground">{selectedTicket.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Прибытие</div>
                    <div className="text-2xl font-bold text-secondary">{selectedTicket.arrival}</div>
                    <div className="font-semibold">{selectedTicket.to}</div>
                    <div className="text-sm text-muted-foreground">{selectedTicket.date}</div>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Время в пути:</span>
                    <span className="font-semibold">{selectedTicket.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Класс обслуживания:</span>
                    <span className="font-semibold">{selectedTicket.class}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Места:</span>
                    <span className="font-semibold">{selectedTicket.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата бронирования:</span>
                    <span className="font-semibold">{selectedTicket.bookingDate}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t">
                    <span>Стоимость:</span>
                    <span>{selectedTicket.price} ₽</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedTicket.status === "active" && (
                  <>
                    <Button className="flex-1" size="lg">
                      <Icon name="Download" size={20} className="mr-2" />
                      Скачать билет
                    </Button>
                    <Button variant="destructive" className="flex-1" size="lg">
                      <Icon name="X" size={20} className="mr-2" />
                      Отменить билет
                    </Button>
                  </>
                )}
                {selectedTicket.status === "completed" && (
                  <Button className="flex-1" size="lg">
                    <Icon name="Download" size={20} className="mr-2" />
                    Скачать архив
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="bg-secondary text-white mt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">О компании</h4>
              <p className="text-sm text-blue-100">
                РЖД Экспресс - современная система онлайн-бронирования железнодорожных билетов
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-blue-100">
                <p>Телефон: 8-800-555-35-35</p>
                <p>Email: info@rzd-express.ru</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Полезное</h4>
              <div className="space-y-2 text-sm text-blue-100">
                <p>Правила перевозок</p>
                <p>Возврат билетов</p>
                <p>Часто задаваемые вопросы</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-600 mt-8 pt-8 text-center text-sm text-blue-100">
            © 2024 РЖД Экспресс. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyTickets;

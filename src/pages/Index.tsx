import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Train {
  id: string;
  number: string;
  departure: string;
  arrival: string;
  duration: string;
  seats: {
    platzkart: { available: number; price: number };
    coupe: { available: number; price: number };
    sv: { available: number; price: number };
  };
}

interface Seat {
  number: number;
  available: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [showResults, setShowResults] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<"platzkart" | "coupe" | "sv" | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const mockTrains: Train[] = [
    {
      id: "1",
      number: "002А",
      departure: "12:30",
      arrival: "08:45",
      duration: "20ч 15м",
      seats: {
        platzkart: { available: 28, price: 2450 },
        coupe: { available: 12, price: 4890 },
        sv: { available: 4, price: 8990 },
      },
    },
    {
      id: "2",
      number: "016Ч",
      departure: "15:20",
      arrival: "11:35",
      duration: "20ч 15м",
      seats: {
        platzkart: { available: 42, price: 2350 },
        coupe: { available: 18, price: 4690 },
        sv: { available: 6, price: 8490 },
      },
    },
    {
      id: "3",
      number: "030А",
      departure: "23:45",
      arrival: "19:20",
      duration: "19ч 35м",
      seats: {
        platzkart: { available: 15, price: 2650 },
        coupe: { available: 8, price: 5090 },
        sv: { available: 2, price: 9290 },
      },
    },
  ];

  const generateSeats = (count: number): Seat[] => {
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      available: Math.random() > 0.3,
    }));
  };

  const handleSearch = () => {
    if (from && to && date) {
      setShowResults(true);
    }
  };

  const handleSelectClass = (train: Train, trainClass: "platzkart" | "coupe" | "sv") => {
    setSelectedTrain(train);
    setSelectedClass(trainClass);
    setSelectedSeats([]);
  };

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const getTotalPrice = () => {
    if (!selectedTrain || !selectedClass) return 0;
    return selectedSeats.length * selectedTrain.seats[selectedClass].price;
  };

  const getClassLabel = (classType: string) => {
    const labels = { platzkart: "Плацкарт", coupe: "Купе", sv: "СВ" };
    return labels[classType as keyof typeof labels];
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
              <Button variant="ghost" className="text-white hover:bg-blue-600" onClick={() => navigate("/my-tickets")}>
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
        <Card className="max-w-4xl mx-auto shadow-xl border-none animate-fade-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary">Поиск билетов</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="from" className="text-base font-medium">
                  Откуда
                </Label>
                <div className="relative">
                  <Icon
                    name="MapPin"
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="from"
                    placeholder="Москва"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="text-base font-medium">
                  Куда
                </Label>
                <div className="relative">
                  <Icon
                    name="MapPin"
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="to"
                    placeholder="Санкт-Петербург"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-base font-medium">Дата отправления</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 justify-start text-left font-normal text-base"
                    >
                      <Icon name="Calendar" size={20} className="mr-2" />
                      {date ? format(date, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} locale={ru} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full h-12 text-base font-semibold" size="lg">
              <Icon name="Search" size={20} className="mr-2" />
              Найти билеты
            </Button>
          </CardContent>
        </Card>

        {showResults && (
          <div className="max-w-4xl mx-auto mt-8 space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-secondary">
              Доступные рейсы: {from} → {to}
            </h3>
            {mockTrains.map((train) => (
              <Card key={train.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="text-lg px-3 py-1">{train.number}</Badge>
                        <span className="text-sm text-muted-foreground">{train.duration}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-secondary">{train.departure}</div>
                          <div className="text-sm text-muted-foreground">{from}</div>
                        </div>
                        <Icon name="ArrowRight" size={24} className="text-primary" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-secondary">{train.arrival}</div>
                          <div className="text-sm text-muted-foreground">{to}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(Object.keys(train.seats) as Array<keyof typeof train.seats>).map((key) => (
                        <Button
                          key={key}
                          variant={selectedTrain?.id === train.id && selectedClass === key ? "default" : "outline"}
                          className="justify-between min-w-[200px]"
                          onClick={() => handleSelectClass(train, key)}
                          disabled={train.seats[key].available === 0}
                        >
                          <span className="font-semibold">{getClassLabel(key)}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{train.seats[key].price} ₽</span>
                            <Badge variant="secondary" className="ml-2">
                              {train.seats[key].available}
                            </Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTrain && selectedClass && (
          <Card className="max-w-4xl mx-auto mt-8 shadow-xl animate-fade-in">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-secondary">
                Выбор мест - {getClassLabel(selectedClass)}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
                {generateSeats(selectedTrain.seats[selectedClass].available + 20).map((seat) => (
                  <Button
                    key={seat.number}
                    variant={selectedSeats.includes(seat.number) ? "default" : "outline"}
                    className={`h-12 ${!seat.available ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => seat.available && handleSeatClick(seat.number)}
                    disabled={!seat.available}
                  >
                    {seat.number}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                  <span className="text-sm">Выбрано</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">Свободно</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded opacity-50"></div>
                  <span className="text-sm">Занято</span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Выбрано мест:</span>
                    <span>{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold text-primary">
                    <span>Итого:</span>
                    <span>{getTotalPrice()} ₽</span>
                  </div>
                </div>
              )}

              <Button
                className="w-full h-12 text-base font-semibold"
                size="lg"
                disabled={selectedSeats.length === 0}
                onClick={() => setShowBookingForm(true)}
              >
                Продолжить оформление
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оформление билета</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Фамилия</Label>
                  <Input placeholder="Иванов" />
                </div>
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input placeholder="Иван" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Паспорт (серия и номер)</Label>
                <Input placeholder="1234 567890" />
              </div>

              <div className="space-y-2">
                <Label>Электронная почта</Label>
                <Input type="email" placeholder="example@mail.ru" />
              </div>

              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input type="tel" placeholder="+7 (900) 123-45-67" />
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Поезд:</span>
                  <span className="font-semibold">{selectedTrain?.number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Класс:</span>
                  <span className="font-semibold">{selectedClass && getClassLabel(selectedClass)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Места:</span>
                  <span className="font-semibold">{selectedSeats.join(", ")}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t">
                  <span>К оплате:</span>
                  <span>{getTotalPrice()} ₽</span>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 text-base font-semibold" size="lg">
              <Icon name="CreditCard" size={20} className="mr-2" />
              Перейти к оплате
            </Button>
          </div>
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

export default Index;
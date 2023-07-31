//- Base de elegíveis (funcionários Cielo + estagiários + menor aprendiz)  Membros da Diretoria Executiva , Superintendentes e Secretárias excluso da campanha em virtude do check-in transparente. Terceiros: excluso da campanha.

import { BookingWebhookDto } from '../dto/booking-webhook.dto';
import { Place } from '../dto/place.dto';
import { CheckInDto } from '../dto/checkin.dto';
import { CheckInWebhookDto } from '../dto/checkInEvent.dto';
import { BookingParsedDto } from '../dto/booking-parsed.dto';

const EVENT_CHECK_IN = 'checkin';
const EVENT_BOOKING = 'booking';

//- Pontuação em reservas de estações de trabalho apenas.

//- Check-in premiado – em locais aleatórios (5, 10, 20 e 30 pontos)

////- A cada check-in (1 ponto)

//- Reserva antecipada – 2 dias de antecedência (ponto extra)

//- Reserva expirada (-1 ponto)

//- Gestão de quem não fez check-in com mensagem positiva, enviar lembrete para que a pessoa não esqueça na próxima reserva.

//- Mesas bloqueadas (Não será pontuado quem utilizar mesas bloqueadas)

export const processReward = (webhookEvent: BookingParsedDto) => {
  if (webhookEvent.event === EVENT_CHECK_IN) {
    
  }
};

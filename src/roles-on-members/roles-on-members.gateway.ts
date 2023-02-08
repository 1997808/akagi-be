import { WebSocketGateway } from '@nestjs/websockets';
import { RolesOnMembersService } from './roles-on-members.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class RolesOnMembersGateway {
  constructor(private readonly rolesOnMembersService: RolesOnMembersService) {}
}

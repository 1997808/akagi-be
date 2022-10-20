import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@WebSocketGateway()
export class RolesGateway {
  constructor(private readonly rolesService: RolesService) {}

  @SubscribeMessage('createRole')
  create(@MessageBody() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @SubscribeMessage('findAllRoles')
  findAll() {
    return this.rolesService.findAll();
  }

  @SubscribeMessage('findOneRole')
  findOne(@MessageBody() id: number) {
    return this.rolesService.findOne(id);
  }

  @SubscribeMessage('updateRole')
  update(@MessageBody() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(updateRoleDto.id, updateRoleDto);
  }

  @SubscribeMessage('removeRole')
  remove(@MessageBody() id: number) {
    return this.rolesService.remove(id);
  }
}

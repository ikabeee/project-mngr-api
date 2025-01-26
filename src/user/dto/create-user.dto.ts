import { ApiProperty } from '@nestjs/swagger';
import { role } from 'src/common/enums/role.enum';
import { statusUser } from 'src/common/enums/statusUser.enum';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  payrollNumber: string;

  @ApiProperty()
  hasTeam: boolean;

  @ApiProperty({
    enum: ['Admin', 'Leader', 'Moderator', 'Collaborator', 'Guest'],
  })
  role: role;

  @ApiProperty()
  teamId: number;

  @ApiProperty({ enum: ['Active', 'Inactive', 'Suspended', 'Deleted'] })
  status: statusUser;
}

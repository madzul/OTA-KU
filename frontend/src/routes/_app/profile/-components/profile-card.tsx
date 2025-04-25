import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Mail, Phone, Calendar } from 'lucide-react'

interface ProfileCardProps {
  name: string
  role: string
  email: string
  phone: string
  joinDate: string
  avatarSrc?: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name = 'Budi Santoso',
  role = 'Orang Tua Asuh',
  email = 'Email@example.com',
  phone = '08129130321321',
  joinDate = 'Bergabung di Maret 2024',
  avatarSrc
}) => {
  return (
    <div>
    <Card className="max-w-sm w-full mx-auto">
      <CardHeader className="flex flex-col items-center justify-center pt-6 pb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          {avatarSrc ? (
            <img 
              src={avatarSrc} 
              alt={`${name}'s avatar`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-lg xl:text-xl font-bold">{name}</h2>
          <p className="text-muted-foreground rounded-xl border-2 px-6 py-1 mt-4">{role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-primary text-sm xl:text-base">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span>{phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{joinDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default ProfileCard

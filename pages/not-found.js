import React from 'react';
import MessageCard from '../components/MessageCard';
import { useRouter } from 'next/router';

export default function RoomNotFound() {
  const router = useRouter();
  return (
    <div className="not-found">
      <MessageCard
        error
        header="Room not found"
        onBack={() => router.push('/')}
      >
        The room you are trying to join does not exist. Have you created the
        room using the Daily REST API or the dashboard?
      </MessageCard>
      <style jsx>{`
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-columns: 620px;
        width: 100%;
        height: 100vh;
      `}</style>
    </div>
  );
}

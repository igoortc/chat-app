// state.ts

import { atom } from 'jotai';
import { TypeMessage } from '../Entities/Message.entity';


export const messagesAtom = atom<TypeMessage[]>([]);

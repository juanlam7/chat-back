import { Request, Response } from 'express';
import Conversation from '../models/conversationModel';
import Message from '../models/messageModel';
import { IUser } from '../models/userModel';
import { getReceiverSocketId, io } from '../socket';

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = (req.user as IUser)._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller: ', (error as any).message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = (req.user as IUser)._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    return res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller: ', (error as any).message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

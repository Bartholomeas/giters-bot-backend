import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { KICK_CATEGORIES_URL } from 'src/kick/kick.constants';

@Injectable()
export class KickCategoriesService {
  constructor() {}

  async getCategories(
    searchQuery = '',
    token = '',
  ): Promise<{
    data: { id: number; name: string; thumbnail: string }[];
    message: string;
  }> {
    const url = new URL(KICK_CATEGORIES_URL);

    if (searchQuery) url.searchParams.append('q', searchQuery);

    try {
      const headers: Record<string, string> = {};

      if (!token) throw new UnauthorizedException('Invalid or expired token');
      headers['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(url.toString(), { headers });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BadRequestException(
          error.response?.data?.message || error.message,
        );
      }

      throw new BadRequestException(error.message);
    }
  }

  async getCategory(categoryId: number, token: string) {
    const url = new URL(`${KICK_CATEGORIES_URL}/${categoryId}`);

    try {
      if (!categoryId) throw new BadRequestException('Invalid category ID');
      if (!token) throw new UnauthorizedException('Invalid or expired token');

      const response = await axios.get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new BadRequestException(
          error.response?.data?.message || error.message,
        );
      }

      throw new BadRequestException(error.message);
    }
  }
}
